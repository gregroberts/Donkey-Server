from flask import Flask, request, Response, abort, render_template
from flask.ext.classy import FlaskView, route
import server_config
from server_query_api import QueryView
from collector_api import CollectorView
from json import dumps
import rq_dashboard
from traceback import format_exc


application = Flask(__name__)
 
QueryView.register(application)
CollectorView.register(application)


#DonkeyView.register(application)
@application.errorhandler(500)
def internal_error(e):
	print e
	return Response(
		response =dumps({'error':str(format_exc())}),
		status = 500,
		mimetype = 'application/json'
	)

application.config['REDIS_HOST'] = server_config.REDIS_HOST
application.config['REDIS_PORT'] = server_config.REDIS_PORT
application.config['REDIS_PASSWORD'] = server_config.REDIS_PW
application.config['RQ_POLL_INTERVAL'] = 2000
application.config['APPLICATION_ROOT'] = server_config.web_prefix
application.register_blueprint(rq_dashboard.blueprint, url_prefix='/redis_queue')


@application.route('/donkey/', defaults={'path':''})
@application.route('/<path:path>')
def index_old(path):
	return render_template('index.html',
		prefix = server_config.web_prefix)


if __name__ == '__main__':


	application.run('0.0.0.0', debug = True)
