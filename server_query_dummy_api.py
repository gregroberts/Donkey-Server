from flask import Flask, request, Response, abort, render_template
from flask.ext.classy import FlaskView, route

from json import dumps

class QueryView(FlaskView):
	@route('/new/', methods=['POST'])
	def new(self):
		details = request.json or {}
		res =  {
			'uuid':'uuid',
			'message':'New Query Successfully Created'
		}
		return Response(
				response = dumps(res),
				status = 200,
				mimetype= 'application/json'
			)

	def load(self, uuid):
		res = {
			'message':'Successfully loaded Query',
			'uuid':'uuid',
		}
		return Response(
				response = dumps(res),
				status = 200,
				mimetype = 'application/json'
			)

	def save(self, uuid):
		details = request.json
		res = {
			'uuid':'uuid',
			'message':'Successfully saved Query'
		}
		return Response(
				response = dumps(res),
				status = 200,
				mimetype = 'application/json'
			)	

	def raw_data(self, uuid):
		res = {
			'message': 'raw_data',
			'data':'<body>YO</body>',
			'uuid':'uuid'
		}
		return Response(
			response =dumps(res),
			status = 200,
			mimetype = 'application/json'
		)

	def data(self, uuid):

		res = {
			'message': 'data',
			'data':{'a':'Y'},
			'uuid':'uuid'
		}
		return Response(
			response =dumps(res),
			status = 200,
			mimetype = 'application/json'
		)

	def handle_query(self, uuid):
		res = {
			'message': 'handle_query',
			'data':{'a':'//text()'},
			'uuid':uuid
		}
		return Response(
			response =dumps(res),
			status = 200,
			mimetype = 'application/json'
		)

	def request_query(self, uuid):
		res = {
			'message': 'request_query',
			'data':{'a':'//text()'},
			'uuid':uuid
		}
		return Response(
			response =dumps(res),
			status = 200,
			mimetype = 'application/json'
		)

	def fetch(self, uuid):
		query = request.json or {}
		res = {
			'message': 'raw_data',
			'data':{'l':'q.raw_data'},
			'uuid':'uuid'
		}
		return Response(
			response =dumps(res),
			status = 200,
			mimetype = 'application/json'
		)

	def handle(self, uuid):
		query = request.json or {}
		res = {
			'message': 'data',
			'data':['p'],
			'uuid':uuid
		}
		return Response(
			response =dumps(res),
			status = 200,
			mimetype = 'application/json'
		)

	def run(self, uuid):
		query = request.json or {}
		res = {
			'message': 'data',
			'data':['ppp'],
			'uuid':'uuid'
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