from flask import Flask, request, Response, abort, render_template
from flask.ext.classy import FlaskView, route
import server_dummy_config as server_config
from server_query_dummy_api import QueryView



class DonkeyView(FlaskView):
	def index(self):
		return render_template('index.html',
			prefix = server_config.web_prefix)

	

	def docs(self, route ):
		return render_template('%s_docs.html' % route,
			prefix = server_config.web_prefix)


	def edit_table_query(self, uuid):
		return render_template(
			'table_query_editor.html',
			uuid = uuid,
			prefix=server_config.web_prefix
		)


	def edit_free(self, name):
		'''this loads the query editing ui.
		'''
		gg = filter(lambda x: '_grabber' in x, grabber.grabbers.__dict__.keys())
		grabbers = map(lambda x: x.replace('_grabber',''),gg)
		handles = filter(lambda x: x.upper() == x, handlers.__dict__.keys())
		if name != 'new':
			query = self.d.get(name)
		else:
			query = {}
		return render_template('query_editor.html',
						 grabbers = grabbers,
						 handlers = handles,
						 query = query,
						 prefix = server_config.web_prefix
						)

	def search(self, query = None):
		queries = self.d.search(query)
		for i in queries:
			i['query'] = dumps(i['query'], indent=4)
		return render_template('list_queries.html',
						results = queries,
						n = len(queries),
						prefix = server_config.web_prefix)

	def list(self):
		return self.search()



if __name__ == '__main__':
	application = Flask(__name__)
	QueryView.register(application)
	DonkeyView.register(application)
	application.run('0.0.0.0', debug = True)
