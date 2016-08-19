from flask import Flask, request, Response, abort, render_template
from flask.ext.classy import FlaskView, route



class CollectorView(FlaskView):
	def run_coll	ector(self):
		'''instigates a collector, adds the specified jobs to it, 
			then returns the job uuids & queue name'''
		pass

	def get_job_result(self):
		'''takes a uuid and a queue name, returns the result
			of that job, if finished, else a status'''
		pass

	def get_jobs_results(self):
		'''takes a queue name and a list of uuids
			returns results or statuses'''
		pass

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

