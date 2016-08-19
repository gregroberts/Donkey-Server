from flask import Flask, request, Response, abort, render_template
from flask.ext.classy import FlaskView, route
from server_query import ServerQuery, list_queries
from json import dumps



class QueryView(FlaskView):
	@route('/new/', methods=['POST'])
	def new(self):
		details = request.json or {}
		q = ServerQuery(**details)
		q.save()
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

	@route('/load/<uuid>', methods=['POST'])
	def load(self, uuid):
		details = request.json
		q = ServerQuery(uuid=uuid, from_where =details['where'])
		res = {
			'message':'Successfully loaded Query',
			'uuid':q.uuid,
			'data':{
				'uuid':q.uuid,
				'handler':q.handler,
				'grabber':q.grabber,
				'request_query':q.request_query,
				'handle_query':q.handle_query,
				'name':q.name,
				'description':q.description,
				'parameters':q.parameters,
				'raw_data': q.raw_data,
				'data':q.data,
			}
		}
		return Response(
				response = dumps(res),
				status = 200,
				mimetype = 'application/json'
			)

	@route('/set_handler/<uuid>', methods=['POST'])
	def set_handler(self, uuid):
		details = request.json
		q = ServerQuery(uuid = uuid)
		q.handler = details['handler']
		q.save()

	@route('/set_grabber/<uuid>', methods=['POST'])
	def set_grabber(self, uuid):
		details = request.json
		q = ServerQuery(uuid = uuid)
		q.grabber = details['grabber']
		q.save()

	@route('/save/<uuid>', methods=['POST'])
	def save(self, uuid):
		details = request.json
		details.update({'where':'library'})
		print details
		q = ServerQuery(uuid = uuid)
		q.save(**details)
		res = {
			'uuid':uuid,
			'message':'Successfully saved Query'
		}
		return Response(
				response = dumps(res),
				status = 200,
				mimetype = 'application/json'
			)

	@route('/fetch/<uuid>', methods=['POST'])
	def fetch(self, uuid):
		query = request.json or {}
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

	@route('/run/<uuid>', methods=['POST'])
	def run(self, uuid):
		query = request.json or {}
		q = ServerQuery(uuid = uuid, from_where = 'library')
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

	def list(self):
		results = list_queries()
		res = {
			'message':'query list',
			'data': results,
		}
		return Response(
			dumps(res),
			status = 200,
			mimetype = 'application/json'
		)
		#print filter(lambda x: x['name'] != '', res)





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
