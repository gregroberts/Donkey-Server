from flask import Flask, request, Response, abort, render_template
from flask.ext.classy import FlaskView, route
from collector import Collector
import collection, scheduler
from redis import Redis
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
	j = job.Job.fetch(job_id, rc)
	return {
		'id':job_id,
		'status':j.status,
		'result':j.result
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
			'data':{
				'jobs':jobs,
				'log':collector.log_data,
			},
			'message':'collector initiated successfully',
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
		print res
		res['message'] = 'fetched job successfully'
		return Response(
			response = dumps(res),
			status = 200,
			mimetype = 'application/json'
		)

	def get_jobs_results(self):
		'''takes a queue name and a list of uuids
			returns results or statuses'''
		details = request.json or {}
		_ids = details['id']
		results = {'data':map(get_job_result, _ids)}
		results['message'] = 'fetched job successfully'
		return Response(
			response = dumps(results),
			status = 200,
			mimetype = 'application/json'
		)		

	def register_collection(self):
		'''takes the neccesaries to set up a collection.
			sets it up in the database
			returns metadata'''
		details = request.json or {}
		scheduler.register_collection(details)
		res = {'message':'collection registered successfully'}
		return Response(
			response = dumps(res),
			status = 200,
			mimetype = 'application/json'
		)


	def schedule_collections(self):
		'''runs the scheduler'''
		things = scheduler.schedule_due_things()
		res = {
			'message':'Scheduled %d Collections' % len(things),
			'data': things
		}
		return Response(
			response = dumps(res),
			status = 200,
			mimetype = 'application/json'
		)		

	def show_collections(self):
		'''fetches all the collections saved on the server'''
		things = scheduler.get_schedule()
		res = {
			'message':'found %d Collections' % len(things),
			'data': things
		}
		return Response(
			response = dumps(res),
			status = 200,
			mimetype = 'application/json'
		)			

	@route('/run_collection/', methods=['POST'])
	def run_collection(self):
		'''re-runs an instance of a collection,
			regardless of whether it needed it'''
		details = request.json or {}
		thing = scheduler.get_thing(details['id'])
		print thing
		scheduler.schedule_thing(thing)
		res = {
			'message':'Scheduled collection',
		}
		return Response(
			response = dumps(res),
			status = 200,
			mimetype = 'application/json'
		)			



