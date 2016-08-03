
import server_config
from uuid import uuid1
from redis import Redis
from copy import copy
from server_cache import cache_insert, cache_check
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
				uuid = None, name = '', description = ''):
		#for handling state
		self.redis_conn = Redis(
			host = server_config.REDIS_HOST,
			port = server_config.REDIS_PORT
		)

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
			self.uuid = uuid
			self.load(uuid)

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


	def save(self, name = None, description =None, where = 'queries'):
		req_q = {
			'request':copy(self.request_query),
			'handle':copy(self.handle_query)
		}
		req_q['request'].update({
			'@freshness':self.freshness,
			'@grabber':self.grabber,
		})
		req_q['handle'].update({
			'@handler':self.handler
		})
		val = {
			'name':name or self.name,
			'description':description or self.description,
			'saved_at':datetime.now().strftime('%Y-%m-%d %H:%M'),
			'query':req_q,
			'uuid':self.uuid,
			'parameters':self.parameters
		}
		print val
		self.redis_conn.hmset('%s:%s' % (where, self.uuid), val)

	def load(self, uuid, where = 'queries'):
		self.uuid = uuid
		to_get = ['query','name','description','parameters']
		value = self.redis_conn.hmget('%s:%s' %(where, uuid), to_get)
		print value
		if value[0] == None:
			raise Exception('Could not find query')
		val = eval(value[0])
		self.freshness = val['request'].pop('@freshness')
		self.grabber = val['request'].pop('@grabber')
		self.handler = val['handle'].pop('@handler')
		self.request_query = val['request']
		self.handle_query = val['handle']
		self.name = value[1]
		self.description = value[2]
		self.parameters = eval(value[3])


	def set_params(self, **params):
		Query.set_params(self, **params)
		self.write_details()





if __name__ == '__main__':
#	print 'making new query'
#	g=ServerQuery()
#	print 'executing new query'
#	print g.fetch(url='http://example.com').handle(title='//title//text()').data
#
#	uuid = g.uuid
#	print 'grabbing query %s' % uuid
#	g = ServerQuery(uuid=uuid)
#	print 'printing fetched data'
#	print g.data
#	print 'updating query'
#	print g.handle(text='//text()').data
#
#	g.save('test','a test')
#	print g.uuid
	g = ServerQuery()
	g.load('e4bd26d1-57fe-11e6-aa35-3417ebcd44f9')
	print g.run()
