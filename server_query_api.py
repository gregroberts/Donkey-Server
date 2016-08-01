from flask import Flask, request, Response, abort, render_template
from flask.ext.classy import FlaskView, route
from server_query import ServerQuery
from json import dumps

class QueryView(FlaskView):
	def new(self):
		details = request.json or {}
		print details
		q = ServerQuery(**details)
		uuid = str(q.uuid)
		print q.handler
		res =  {
			'uuid':uuid,
			'message':'New Query Successfully Created'
		}
		return Response(
				response = dumps(res),
				status = 200,
				mimetype= 'application/json'
			)

	def load(self, uuid):
		q = ServerQuery()
		q.load(uuid)
		res = {
			'message':'Successfully loaded Query',
			'uuid':uuid,
		}
		return Response(
				response = dumps(res),
				status = 200,
				mimetype = 'application/json'
			)

	def save(self, uuid):
		details = request.json
		q = ServerQuery(uuid = uuid)
		q.save(details['name'], details['description'])
		res = {
			'uuid':uuid,
			'message':'Successfully saved Query'
		}
		return Response(
				response = dumps(res),
				status = 200,
				mimetype = 'application/json'
			)	

	def raw_data(self, uuid):
		q = ServerQuery(uuid = uuid)
		res = {
			'message': 'raw_data',
			'data':q.raw_data,
			'uuid':uuid
		}
		return Response(
			response =dumps(res),
			status = 200,
			mimetype = 'application/json'
		)

	def data(self, uuid):
		q = ServerQuery(uuid = uuid)
		res = {
			'message': 'data',
			'data':q.data,
			'uuid':uuid
		}
		return Response(
			response =dumps(res),
			status = 200,
			mimetype = 'application/json'
		)

	def handle_query(self, uuid):
		q = ServerQuery(uuid = uuid)
		res = {
			'message': 'handle_query',
			'data':q.handle_query,
			'uuid':uuid
		}
		return Response(
			response =dumps(res),
			status = 200,
			mimetype = 'application/json'
		)

	def request_query(self, uuid):
		q = ServerQuery(uuid = uuid)
		res = {
			'message': 'request_query',
			'data':q.request_query,
			'uuid':uuid
		}
		return Response(
			response =dumps(res),
			status = 200,
			mimetype = 'application/json'
		)

	def fetch(self, uuid):
		query = request.json or {}
		print query
		q = ServerQuery(uuid = uuid)
		q.fetch(**query)
		res = {
			'message': 'raw_data',
			'data':q.raw_data,
			'uuid':uuid
		}
		return Response(
			response =dumps(res),
			status = 200,
			mimetype = 'application/json'
		)

	def handle(self, uuid):
		query = request.json or {}
		q = ServerQuery(uuid = uuid)
		q.handle(**query)
		res = {
			'message': 'data',
			'data':q.data,
			'uuid':uuid
		}
		print q.handler
		return Response(
			response =dumps(res),
			status = 200,
			mimetype = 'application/json'
		)

	def run(self, uuid):
		query = request.json or {}
		q = ServerQuery(uuid = uuid)
		res = {
			'message': 'data',
			'data':q.run(**query),
			'uuid':uuid
		}
		return Response(
			response =dumps(res),
			status = 200,
			mimetype = 'application/json'
		)





if __name__ == '__main__':
	application = Flask(__name__)
	QueryView.register(application)	
	application.run(host='0.0.0.0', debug = True)