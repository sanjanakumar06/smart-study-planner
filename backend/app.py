from flask import Flask, request, jsonify
from datetime import datetime, timedelta

app = Flask(__name__)

# Example in-memory data stores
users = {}
tasks = {}
sessions = {}

@app.route('/add_task', methods=['POST'])
def add_task():
    data = request.json
    task_id = len(tasks) + 1
    tasks[task_id] = {
        'title': data['title'],
        'description': data.get('description', ''),
        'due_date': data['due_date'],
        'estimated_time': data['estimated_time'],
        'done': False
    }
    return jsonify({'success': True, 'task_id': task_id})

@app.route('/log_session', methods=['POST'])
def log_session():
    data = request.json
    session_id = len(sessions) + 1
    sessions[session_id] = {
        'user_id': data['user_id'],
        'date': data['date'],
        'energy_level': data['energy_level'],
        'available_hours': data['available_hours']
    }
    return jsonify({'success': True, 'session_id': session_id})

@app.route('/generate_schedule', methods=['GET'])
def generate_schedule():
    # Basic scheduling logic: prioritize urgent tasks and match with high-energy sessions
    today = datetime.now().date()
    schedule = []
    for session_id, session in sessions.items():
        if session['date'] >= str(today):
            # Find tasks not done, sorted by due date
            pending_tasks = [t for t in tasks.values() if not t['done']]
            pending_tasks.sort(key=lambda x: x['due_date'])
            hours_left = session['available_hours']
            for task in pending_tasks:
                if hours_left <= 0:
                    break
                if task['estimated_time'] <= hours_left:
                    schedule.append({
                        'session_id': session_id,
                        'task_title': task['title'],
                        'planned_hours': task['estimated_time']
                    })
                    hours_left -= task['estimated_time']
    return jsonify({'schedule': schedule})

if __name__ == '__main__':
    app.run(debug=True)
