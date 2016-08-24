from rq import Queue, job
from redis import Redis
import server_config
import MySQLdb as mdb
from collector import Collector
from datetime import datetime
from MySQLdb.cursors import DictCursor
from collection import Collection, get_sql_conn
import json

def get_schedule():
	conn = get_sql_conn()
	c = conn.cursor(cursorclass=DictCursor)
	c.execute('''
	SELECT *,
		 DATE_ADD(LastRun,INTERVAL Frequency DAY) <= Now()  as due
	from Collections''')
	colls = c.fetchall()
	c.close()
	conn.close()
	for ind, item in enumerate(colls):
		colls[ind]['LastRun'] = str(item['LastRun'])	
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
		     LastRun = Now()
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

def schedule_thing(item):
	birth(item['id'])
	x =  Collection(
		item['CollectionName'], 
		item['QueryName'],
		item['QueueName'],
		item['TableName']	
	)
	jobs = x.schedule(item['Input'], item['InputType'])
	last = jobs[-1]
	redis_conn = Redis(
		host=server_config.REDIS_HOST,
		port=server_config.REDIS_PORT,
	)
	queue = Queue('collections',connection = redis_conn)
	queue.enqueue(finit, kwargs={'_id':item['id']}, depends_on=last)

def get_thing(_id):
	conn = get_sql_conn()
	c = conn.cursor(cursorclass=DictCursor)
	c.execute('SELECT * from Collections WHERE id= %s LIMIT 1' % _id)	
	res = c.fetchone()
	c.close()
	conn.close()
	return res

def schedule_due_things():
	things = get_due_items()
	print things
	for ind, item in enumerate(things):
		schedule_thing(item)
	return things



def register_collection(details):
	req_keys = [
		'CollectionName',
		'QueryName',
		'TableName',
		'QueueName',
		'Frequency',
		'Input',
		'InputType',
	]
	if set(map(str,details.keys()))!= set(req_keys):
		missing = filter(lambda x: x not in details.keys(), req_keys)
		raise Exception('Missing Arguments: %s' % ','.join(missing))
	conn = get_sql_conn()
	c = conn.cursor()
	c.execute('''
		INSERT INTO Collections
		(CollectionName, QueryName, TableName, QueueName, Frequency, Input,InputType)
		VALUES
			(%(CollectionName)s,
			%(QueryName)s, 
			%(TableName)s, 
			%(QueueName)s, 
			%(Frequency)s, 
			%(Input)s,
			%(InputType)s)
	''', args = details)
	c.close()
	conn.commit()
	_id = conn.insert_id()
	conn.close()
	return _id

def update_collection(details):
	req_keys = [
		'CollectionName',
		'QueryName',
		'TableName',
		'QueueName',
		'Frequency',
		'Input',
		'InputType',
		'id',
	]
	if set(map(str,details.keys())) != set(req_keys):
		missing = filter(lambda x: x not in details.keys(), req_keys)
		raise Exception('Missing Arguments: %s' % ','.join(missing))
	conn = get_sql_conn()
	c = conn.cursor()
	c.execute('''
	UPDATE Collections
		SET CollectionName = %(CollectionName)s,
			QueryName = %(QueryName)s,
			TableName = %(TableName)s,
			QueueName = %(QueueName)s,
			Frequency = %(Frequency)s,
			Input = %(Input)s,
			InputType = %(InputType)s
	WHERE id = %(id)s
	''', args=details)
	c.close()
	conn.commit()
	conn.close()	
	

def delete_collection(_id):
	conn = get_sql_conn()
	c = conn.cursor()
	c.execute('''DELETE FROM Collections WHERE id = %(id)s''',
			args={'id':_id})
	conn.commit()
	c.close()
	conn.close()	