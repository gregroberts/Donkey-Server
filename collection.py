from rq import Queue, job
from redis import Redis
import server_config
import MySQLdb as mdb
from collector import Collector
from datetime import datetime
from MySQLdb.cursors import DictCursor


def get_sql_conn(st= 't'):
	if st == 't':
		conn = mdb.connect(
			host=server_config.TRGT_SQL_HOST,
			port=server_config.TRGT_SQL_PORT,
			user=server_config.TRGT_SQL_USER,
			passwd=server_config.TRGT_SQL_PSWD,
			db=server_config.TRGT_SQL_SCHM
		)
	elif st=='s':
		conn = mdb.connect(
			host=server_config.SRC_SQL_HOST,
			port=server_config.SRC_SQL_PORT,
			user=server_config.SRC_SQL_USER,
			passwd=server_config.SRC_SQL_PSWD,
			db=server_config.SRC_SQL_SCHM
		)		
	return conn

def mk_table(table_name, columns, db_cursor):
	col_stmnt = ',\n'.join(map(lambda x: '`%s` TEXT(500)' % x,columns))
	statement = '''CREATE TABLE IF NOT EXISTS `%s`.`%s` (
		`id` int(11) NOT NULL AUTO_INCREMENT,
		`Collected` datetime,
		`etl_status` int(2) DEFAULT 0,
		%s,
		PRIMARY KEY (`id`)
	) ENGINE=InnoDB AUTO_INCREMENT=168 DEFAULT CHARSET=latin1;
	''' % (server_config.TRGT_SQL_SCHM, table_name, col_stmnt)
	try:
		db_cursor.execute(statement)
	except Exception as e:
		raise(Exception('%s - %s' % (e,statement)))

def insert_res_set(table_name, res):
	conn = get_sql_conn()
	c = conn.cursor()
	if type(res) == list:
		cols = res[0].keys()
		col_st = ', '.join(map(lambda x: '%('+x+')s', cols))
		do = c.executemany
	elif type(res) == dict:
		cols = res.keys()
		col_st = ', '.join(map(lambda x: '%('+x+')s', cols))
		do = c.execute
	mk_table(table_name, cols, c)
	bits = (
		server_config.TRGT_SQL_SCHM,
		table_name,
		','.join(cols), 
		datetime.now(),
		col_st
	)
	stmnt = 'INSERT INTO %s.%s (Collected, %s) VALUES (\'%s\', %s)' % bits
	do(stmnt, args = res)
	conn.commit()
	c.close()
	conn.close()

def consume_data(job_id, table_name):
	rc = Redis(
			host=server_config.REDIS_HOST,
			port=server_config.REDIS_PORT,
		)
	j = job.Job.fetch(job_id, rc)
	results = j.result
	#if failed, fail die gracefully, log fail
	insert_res_set(table_name, results)


class Collection:
	def __init__(self, collection_name, query_name, queue_name, table_name):
		self.collection_name = collection_name
		self.redis_conn = Redis(
			host=server_config.REDIS_HOST,
			port=server_config.REDIS_PORT,
		)
		self.table_name = table_name
		self.queue = Queue('collections',connection = self.redis_conn)
		self.query_name = query_name
		self.collector = Collector(query_name, collection_name, queue_name)

	def schedule(self, job_parameters):
		self.collector.set_parameters(job_parameters)
		self.collector.run_jobs()
		finishings = map(self.add_finisher, self.collector.jobs)
		return finishings

	def add_finisher(self, job):
		return self.queue.enqueue(
			consume_data,
			kwargs = {'job_id':job.id,'table_name':self.table_name},
			depends_on = job
		)

	def schedule_from_json(self, json):
		return self.schedule(json)

	def schedule_from_sql(self, sql):
		conn = get_sql_conn('s')
		c = conn.cursor(cursorclass = DictCursor)
		c.execute(sql)
		res = c.fetchall()
		c.close()
		conn.close()
		return self.schedule(res)







