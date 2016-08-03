from flask import Flask, request, Response, abort, render_template
from flask.ext.classy import FlaskView, route
from server_query import ServerQuery
from json import dumps



class QueryView(FlaskView):
	@route('/new/', methods=['POST'])
	def new(self):
		details = request.json or {}
		q = ServerQuery(**details)
		uuid = str(q.uuid)
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
			'data':{
				'handler':q.handler,
				'grabber':q.grabber,
				'request_query':q.request_query,
				'handle_query':q.handle_query,
				'name':q.name,
				'description':q.description,
				'parameters':q.parameters
			}
		}
		return Response(
				response = dumps(res),
				status = 200,
				mimetype = 'application/json'
			)

	@route('/save/<uuid>', methods=['POST'])
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
		print q.handle_query
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

	def get_parameters(self, uuid):
		q = ServerQuery(uuid = uuid)
		params = q.get_params()
		res = {
			'message': 'parameters',
			'data':params,
			'uuid':uuid
		}
		return Response(
			response =dumps(res),
			status = 200,
			mimetype = 'application/json'
		)

	@route('/set_parameters/<uuid>', methods=['POST'])
	def set_parameters(self, uuid):
			details = request.json or {}
			q = ServerQuery(uuid = uuid)
			params = q.set_params(**details)
			res = {
				'message':'parameters successfully set',
				'data':params,
				'uuid':uuid
			}
			return Response(
				response =dumps(res),
				status = 200,
				mimetype = 'application/json'
			)

	@route('/fetch/<uuid>', methods=['POST'])
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

	@route('/handle/<uuid>', methods=['POST'])
	def handle(self, uuid):
		query = request.json or {}
		q = ServerQuery(uuid = uuid)
		q.handle(**query)
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

	@route('/run/<uuid>', methods=['POST'])
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
	@application.errorhandler(500)
	def internal_error(e):
		print e
		return Response(
			response =dumps({'error':str(e)}),
			status = 500,
			mimetype = 'application/json'
		)
	application.run(host='0.0.0.0', debug=False)
