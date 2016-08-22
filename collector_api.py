from flask import Flask, request, Response, abort, render_template
from flask.ext.classy import FlaskView, route
from collector import Collector
from json import dumps
from rq import job
import server_config



def get_job_result(job_id):
	'''takes a uuid and a queue name, returns the result
			of that job, if finished, else a status'''
	rc = Redis(
		host=server_config.REDIS_HOST,
		port=server_config.REDIS_PORT,
	)
	job = job.Job.fetch(job_id, rc)
	return {
		'id':job_id,
		'status':job.status,
		'result':job.result
	}


class CollectorView(FlaskView):
	def run_collector(self):
		'''instigates a collector, adds the specified jobs to it, 
			then returns the job uuids & queue name'''
		details = request.json or {}
		_input = details.pop('input')
		input_type = details.pop('input_type')
		collector = Collector(**details)
		jobs = collector.schedule_jobs(_input, input_type)
		res = {
			'message':'collector initiated successfully',
			'log':collector.log_data,
			'jobs':jobs
		}
		return Response(
				response = dumps(res),
				status = 200,
				mimetype = 'application/json'
			)

	def get_job_result(self):
		'''takes a uuid and a queue name, returns the result
			of that job, if finished, else a status'''
		details = request.json or {}
		res = get_job_result(details['id'])
		res['message'] = 'fetched job successfully'
		return Response(
			response = dumps(res),
			status = 500,
			mimetype = 'application/json'
		)

	def get_jobs_results(self):
		'''takes a queue name and a list of uuids
			returns results or statuses'''
		details = request.json or {}
		_ids = details['id']
		results = map(get_jobs_results, _ids)
		results['message'] = 'fetched job successfully'
		return Response(
			response = dumps(results),
			status = 500,
			mimetype = 'application/json'
		)		

	def register_collection(self):
		'''takes the neccesaries to set up a collection.
			sets it up in the database
			returns metadata'''
		pass

	def schedule_collections(self):
		'''runs the scheduler'''
		pass

	def show_collections(self):
		'''fetches all the collections saved on the server'''
		pass

	def run_collection(self):
		'''re-runs an instance of a collection,
			regardless of whether it needed it'''
		pass

