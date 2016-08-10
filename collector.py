from server_query import ServerQuery
from datetime import datetime


class Collector:
	collector_name = 'Collector'
	query_name = ''
	parameter_set = []
	result_set = []
	log_data = []
	state = True

	def log(self, line, l_type = 'message'):
		self.log_data.append([str(datetime.now()), line, l_type])
		print line
		if l_type == 'error':
			raise Exception(line)

	def __init__(self, query_name, name = None):
		self.collector_name = name or self.collector_name
		self.log('collector instanciated with name %s' % self.collector_name)
		self.query_name = query_name
		self.log('loading query with name %s' % self.query_name)
		try:
			self.Query = ServerQuery(uuid = query_name, from_where='library')
			self.log('loaded query')
		except Exception as e:
			self.log('failed to load query, with exception %s' % str(e), 'error')
		
	def set_parameters(self, parameter_set):
		self.parameter_set = parameter_set
		self.log('loaded %d rows of parameters' % len(self.parameter_set))

	def run_job(self, row):
		result = self.Query.run(**row)
		self.log('running job %s' % row)
		if type(result) == dict:
			self.result_set.append(result)
		elif type(result) == list:
			self.result_set.extend(result)
		else:
			raise Exception('result type %s not recognised' % type(result))

	def run_jobs(self):
		self.log('running jobs!')
		for index, job in enumerate(self.parameter_set):
			self.log('starting job %d' % (index+1))
			try:
				self.run_job(job)
				self.log('job ran successfully')
			except Exception as e:
				self.log('job failed with error %s' % str(e), 'error')







class CollectorJob:
	def __init__(self, query_name, job_params):
		pass

