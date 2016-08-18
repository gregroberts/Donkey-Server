from rq import Queue, job
from redis import Redis
import server_config
import MySQLdb as mdb
from collector import Collector
from datetime import datetime
from MySQLdb.cursors import DictCursor
from collection import Collection, get_sql_conn

def get_schedule():
	conn = get_sql_conn()
	c = conn.cursor(cursorclass=DictCursor)
	c.execute('''
	SELECT *,
		 DATE_ADD(LastRun,INTERVAL Frequency DAY) <= curdate()  as due
	from Collections''')
	colls = c.fetchall()
	c.close()
	conn.close()
	return colls

def get_due_items():
	colls = get_schedule()
	todo = filter(
		lambda x: x['IsRunning'] == 0 and \
			     x['due'] == 1,
			     colls
		)
	print '%d Collections todo' % len(colls)
	return todo

def birth(_id):
	conn = get_sql_conn()
	c = conn.cursor()
	c.execute('''
		UPDATE Collections
		SET IsRunning = 1,
		     LastRun = curdate()
		WHERE id = %(id)s
	''', args = {'id':_id})
	c.close()
	conn.commit()
	conn.close()

def finit(_id):
	conn = get_sql_conn()
	c = conn.cursor()
	c.execute('''
		UPDATE Collections
		SET IsRunning = 0
		WHERE id = %(id)s
	''', args = {'id':_id})
	c.close()
	conn.commit()
	conn.close()

def schedule_due_things():
	things = get_due_items()
	print things
	for item in things:
		birth(item['id'])
		x =  Collection(
			item['CollectionName'], 
			item['QueryName'],
			item['QueueName'],
			item['TableName']	
		)
		if item['InputType'] == 'sql':
			jobs = x.schedule_from_sql(item['Input'])
		elif item['InputType'] == 'json':
			inp = json.loads(item['Input'])
			jobs = x.schedule_from_json(inp)
		else:
			'WHAT?'
			jobs=[-1]
		last = jobs[-1]
		redis_conn = Redis(
			host=server_config.REDIS_HOST,
			port=server_config.REDIS_PORT,
		)
		queue = Queue('collections',connection = redis_conn)
		queue.enqueue(finit, kwargs={'_id':item['id']}, depends_on=last)


	
