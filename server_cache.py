import server_config
from cPickle import loads,dumps
from redis import StrictRedis
from uuid import uuid1
from time import time

#this script controls the cache for the server
#replaces donkey.cache module
def get_rc():
	redis_conn = StrictRedis(
			host = server_config.REDIS_HOST,
			port = server_config.REDIS_PORT,
			password = server_config.REDIS_PW
	)
	redis_conn.execute_command('AUTH %s' % server_config.REDIS_PW)
	return redis_conn


def cache_insert(s_key, val):
	c_key = dumps(s_key)
	uuid = str(uuid1())
	redis_conn  = get_rc()
	entry = {
		'uuid': uuid,
		'time': time(),
		'response': val
	}
	stuff = redis_conn.hmset('cache:%s' % c_key, entry)


def cache_check(key, freshness = 30):
	c_key = dumps(key)
	since = time() - freshness * 86400
	redis_conn  = get_rc()
	res = redis_conn.hmget('cache:%s' % c_key, ['time','response'])
	if any(map(lambda x: x==None, res)):
		return False
	else:
		if float(res[0]) > since:
			return res[1]
		else:
			return False



