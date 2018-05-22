from flask import Flask, render_template, request, session, redirect, url_for, flash
import sys
import os
reload(sys)
sys.setdefaultencoding('utf-8')


app = Flask(__name__)

app.secret_key = 'keysmithsmakekeys'


@app.route('/')                                                                 
def root():
    return render_template('root.html')

@app.route('/chat' , methods=['POST','GET'])
def about():
    name = request.form['chatname']
    room = request.form['room']
    #session['name'] = name
    #session['room'] = room
    return render_template('chat.html', room=room, name=name)
    


if __name__ == '__main__':
    app.debug = True
    app.run()
