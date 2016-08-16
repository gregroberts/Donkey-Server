from server_query import ServerQuery
from datetime import datetime
from rq import Queue
from server_config import REDIS_HOST,REDIS_PORT,REDIS_PW
from redis import Redis


class Collector:
	collector_name = 'Collector'
	query_name = ''
	parameter_set = []
	result_set = []
	log_data = []
	state = True
	jobs = []
	def log(self, line, l_type = 'message'):
		'''writes to the log'''
		self.log_data.append([str(datetime.now()), line, l_type])
		print line
		if l_type == 'error':
			raise Exception(line)

	def __init__(self, query_name, name = None, queue_name = 'default'):
		self.collector_name = name or self.collector_name
		self.log('collector instanciated with name %s' % self.collector_name)
		self.query_name = query_name
		self.log('loading query with name %s' % self.query_name)
		self.redis_conn = Redis(host=REDIS_HOST,port=REDIS_PORT)
		self.queue = Queue(queue_name, connection=self.redis_conn, async=True)
		try:
			self.Query = ServerQuery(uuid = query_name, from_where='library')
			self.log('loaded query')
		except Exception as e:
			self.log('failed to load query, with exception %s' % str(e), 'error')
		
		
	def set_parameters(self, parameter_set):
		'''provide all the parameters of the collection'''
		self.parameter_set = parameter_set
		self.log('loaded %d rows of parameters' % len(self.parameter_set))

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


		

