from flask import Flask, request, Response, abort, render_template
from flask.ext.classy import FlaskView, route
import server_config
from server_query_api import QueryView
from json import dumps


class DonkeyView(FlaskView):
	def index_old(self):
		return render_template('index.html',
			prefix = server_config.web_prefix)

	def docs(self, route ):
		return render_template('%s_docs.html' % route,
			prefix = server_config.web_prefix)


	def edit_row_query(self, uuid):
		return render_template(
			'row_query_editor.html',
			uuid = uuid,
			prefix=server_config.web_prefix
		)
	def edit_table_query(self, uuid):
		return render_template(
			'table_query_editor.html',
			uuid = uuid,
			prefix=server_config.web_prefix
		)

	def list_queries(self):
		return render_template(
			'query_list.html',
			prefix=server_config.web_prefix
		)

	def index(self):
		return render_template(
			'test_js.html'
		)


application = Flask(__name__)

QueryView.register(application)

@application.route('/donkey/', defaults={'path':''})
@application.route('/<path:path>')
def index_old(path):
	return render_template('test_js.html',
		prefix = server_config.web_prefix)


if __name__ == '__main__':

	#DonkeyView.register(application)
	@application.errorhandler(500)
	def internal_error(e):
		print e
		return Response(
			response =dumps({'error':str(e)}),
			status = 500,
			mimetype = 'application/json'
		)
	application.run('0.0.0.0', debug = True)
