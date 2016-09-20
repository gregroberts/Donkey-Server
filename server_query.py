
import server_config
from uuid import uuid1
from redis import Redis
from copy import copy
from server_cache import cache_insert, cache_check, get_rc
from datetime import datetime
import sys
sys.path.insert(0,'C:\Users\gregr.PACKTPUB\Documents\GitHub\\Donkey')


import donkey.query

Query = donkey.query.Query


#replace caching functions with server cache functions
donkey.query.grabber.cache_insert = cache_insert
donkey.query.grabber.cache_check = cache_check





class ServerQuery(Query):
	parameters = []
	name = ''
	description  =''
	def __init__(self, grabber = None, handler =None, freshness = None,
				uuid = None, name = '', description = '', from_where = 'queries'):
		#for handling state
		self.redis_conn = get_rc()
		#initiate normal query
		Query.__init__(
			self,
			grabber = grabber,
			handler = handler,
			freshness = freshness
		)
		if uuid is None:
			#new query, write state to redis
			self.uuid = str(uuid1())
			self.save()
		else:
			#existing query, read state from redis
			self.load(uuid, where = from_where)

	#replace handle, fetch and run with ones which interact with redis and wrap the originals
	def fetch(self,update = True,  **qry):
		Query.fetch(self, update=update, **qry)
		self.save()
		return self

	def handle(self, update = True, **qry):
		Query.handle(self, update=update, **qry)
		self.save()
		return self

	def run(self, **kwargs):
		res = Query.run(self, **kwargs)
		self.save()
		return res


	def save(self, name = None, description =None,
		handler=None, grabber= None, parameters = None,
		handle_query = None, request_query = None, 
		uuid = None, freshness = None, where = 'queries'):
		if parameters != None:
			self.request_query = request_query or self.request_query
			parameters = self.set_params(**parameters)
			request_query = self.request_query
		val = {
			'name':name or self.name,
			'description':description or self.description,
			'saved_at':datetime.now().strftime('%Y-%m-%d %H:%M'),
			'grabber':self.grabber,
			'handler':self.handler,
			'freshness':self.freshness,
			'request_query':self.request_query,
			'handle_query':self.handle_query,
			'crawl_query':self.crawl_query,
			'uuid':uuid or self.uuid,
			'parameters':self.parameters,
			'raw_data': self.raw_data,
		}
		if where == 'queries':
			key = self.uuid
		elif where =='library':
			key = name or self.name
		self.redis_conn.hmset('%s:%s' % (where, key), val)

	def load(self, key, where = 'queries'):
		if where =='queries':
			self.uuid = key
		to_get = ['name','description','parameters',
				'raw_data','uuid', 'handle_query',
				'request_query','crawl_query','freshness','handler',
				'grabber']
		value = self.redis_conn.hmget('%s:%s' %(where, key), to_get)
		if value[0] == None:
			raise Exception('Could not find query \'%s\', got: %s' % (key, str(value)))
		self.name = value[0]
		self.description = value[1]
		self.parameters = eval(value[2])
		self.raw_data = value[3]
		self.uuid = value[4]
		self.handle_query = eval(value[5])
		self.request_query = eval(value[6])
		self.crawl_query = eval(value[7])
		self.freshness = int(value[8])
		self.handler = value[9]
		self.grabber = value[10] 



	def set_params(self, **params):
		Query.set_params(self, **params)
		self.save()


def list_queries(where = 'library'):
	redis_conn = get_rc()
	vals = ['name','description','uuid','grabber','handler','request_query','handle_query',]
	saves = redis_conn.keys( '%s:*' %where)
	rr = []
	for i in saves:
		val = redis_conn.hmget( i, vals)
		print val
		val[-1] = eval(val[-1])
		val[-2] = eval(val[-2])
		rr.append(dict(zip(vals, val)))
	return rr

def delete_query(what, where = 'library'):
	redis_conn = get_rc()
	redis_conn.delete('%s:%s' % (where,what))
	return True




if __name__ == '__main__':
	g = ServerQuery()
	g.load('e4bd26d1-57fe-11e6-aa35-3417ebcd44f9')
	print g.run()
