from server_query import ServerQuery
from server_cache import get_rc
from datetime import datetime
from rq import Queue
import server_config
from MySQLdb.cursors import DictCursor
from json import loads
import MySQLdb as mdb

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


class Collector:

	
	def log(self, line, l_type = 'message'):
		'''writes to the log'''
		self.log_data.append([str(datetime.now()), line, l_type])
		if l_type == 'error':
			raise Exception(line)

	def __init__(self, QueryName, CollectionName = None, QueueName = 'default'):
		self.parameter_set = []
		self.result_set = []
		self.log_data = []
		self.jobs = []
		self.collector_name = CollectionName
		self.log('collector instanciated with name %s' % self.collector_name)
		self.query_name = QueryName
		self.log('loading query with name %s' % self.query_name)
		self.redis_conn = get_rc()
		self.queue = Queue(QueueName, connection=self.redis_conn, async=True)

		try:
			self.Query = ServerQuery(uuid = QueryName, from_where='library')
			self.log('loaded query')
		except Exception as e:
			self.log('failed to load query, with exception %s' % str(e), 'error')
		
		
	def set_parameters(self, parameter_set):
		'''provide all the parameters of the collection'''
		self.parameter_set = parameter_set
		self.log('loaded %d rows of parameters' % len(self.parameter_set))

	def set_parameters_from_json(self, json):
		try:
			self.set_parameters(loads(json))
		except Exception as e:
			self.log('Failed to parse json input with exception :%s' % e, 'error')

	def set_parameters_from_sql(self, sql):
		conn = get_sql_conn('s')
		c = conn.cursor(cursorclass = DictCursor)
		c.execute(sql)
		res = c.fetchall()
		c.close()
		conn.close()
		self.set_parameters(res)	

	def schedule_jobs(self, _input, input_type = 'list'):
		if input_type == 'json':
			self.set_parameters_from_json(_input)
		elif input_type == 'sql':
			self.set_parameters_from_sql(_input)
		elif input_type == 'list':
			self.set_parameters(_input)
		else:
			self.log('Input type %s not recognised' % input_type, 'error')
		self.run_jobs()
		return map(lambda x: x.id, self.jobs)

	def get_result(self, index):
		'''checks on the progress of a job. If complete
			returns the result, else False'''
		job = self.jobs[index]
		if job.is_failed:
			return 'failed'
		elif job.is_finished:
			return job.result
		else:
			return False

	def run_job(self, params):
		return self.queue.enqueue(
			collector_job,
			kwargs={
				'query_name':self.query_name,
				'job_params':params
			})

	def run_jobs(self):
		self.log('running jobs!')
		for index, job in enumerate(self.parameter_set):
			self.log('starting job %d' % (index+1))
			self.jobs.append(self.run_job(job))

	def check_progress(self):
		res = map(self.get_result, range(len(self.jobs)))
		return {
			'failed':len(filter(lambda x: x=='failed',res)),
			'not_finished':len(filter(lambda x: x==False, res)),
			'finished':len(filter(lambda x: x!= False and x!= 'failed', res))
		}
	
	def get_results(self):
		return map(self.get_result, range(len(self.jobs)))



def collector_job(query_name, job_params):
	Query = ServerQuery(uuid = query_name, from_where='library')
	return Query.run(**job_params)


		

