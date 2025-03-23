from datetime import datetime
import json
import matplotlib.pyplot as plt
import os

JSON_FOLDER= 'results/'
JSON_FILE = ''
FILTERS = []

THREAD_MODE = ' (M)'

COLORS = ['blue', 'green', 'red', 'purple', 'orange', 'brown', 'pink', 'gray', 'olive', 'cyan']

APPLICATIONS = {
    '3000': 'Express.js',
    '3001': 'Fastify',
    '3002': 'JAX-RS',
    '3003': 'HttpServlet'
}

METRICS = {
    'iterations': 'Iterationen',
    'data_received': 'Datengröße (in kB)',
    'data_sent': 'Datengröße (in kB)',
    'vus': 'Anzahl',
    'http_reqs': 'Anzahl',
    'http_req_duration': 'Zeit (in ms)',
    'http_req_waiting': 'Zeit (in ms)',
    'http_req_blocked': 'Zeit (in ms)',
    'http_req_failed': 'Anzahl',
    'http_req_tls_handshaking': 'Zeit (in ms)',
    'http_req_receiving': 'Zeit (in ms)',
    'http_req_sending': 'Zeit (in ms)',
    'http_req_connecting': 'Zeit (in ms)',
    'checks': 'Anteil (in %)',
}

TITLES = {
    'iterations': 'Iterationen',
    'data_received': 'Erhaltene Daten',
    'data_sent': 'Gesendete Daten',
    'vus': 'Virtuell simulierte Nutzer',
    'http_reqs': 'HTTP-Anfragen',
    'http_req_duration': 'Durchschnittliche Dauer für HTTP-Anfragen',
    'http_req_waiting': 'Durchschnittliche Wartezeit für HTTP-Anfragen',
    'http_req_blocked': 'Durchschnittliche Blockierte Zeit für HTTP-Anfragen',
    'http_req_failed': 'Fehlgeschlagene HTTP-Anfragen',
    'http_req_tls_handshaking': 'Durchschnittliche TLS-Handshake-Dauer',
    'http_req_receiving': 'Durchschnittliche Empfangszeit für HTTP-Anfragen',
    'http_req_sending': 'Durchschnittliche Sendezeit für HTTP-Anfragen',
    'http_req_connecting': 'Durchschnittliche Verbindungszeit für HTTP-Anfragen',
    'checks': 'Checks',
    '01': '(single-threaded)',
    '01|multi': f'(multi-threaded{THREAD_MODE})',
    '02': '(single-threaded)',
    '02|multi': f'(multi-threaded{THREAD_MODE})',
    '03': '(single-threaded)',
    '03|multi': f'(multi-threaded{THREAD_MODE})',
    '04': '(single-threaded)',
    '04|multi': f'(multi-threaded{THREAD_MODE})',
    '05': '(single-threaded)',
    '05|multi': f'(multi-threaded{THREAD_MODE})',
    '06': '(single-threaded)',
    '06|multi': f'(multi-threaded{THREAD_MODE})',
    '07': '(single-threaded)',
    '07|multi': f'(multi-threaded{THREAD_MODE})',
    '08': '(single-threaded)',
    '08|multi': f'(multi-threaded{THREAD_MODE})',
    '09': '(single-threaded)',
    '09|multi': f'(multi-threaded{THREAD_MODE})',
    '10': '(single-threaded)',
    '10|multi': f'(multi-threaded{THREAD_MODE})',
    '11': '(single-threaded)',
    '11|multi': f'(multi-threaded{THREAD_MODE})',
    '12': '(single-threaded)',
    '12|multi': f'(multi-threaded{THREAD_MODE})',
    '13': '(single-threaded)',
    '13|multi': f'(multi-threaded{THREAD_MODE})',
    '14': '(single-threaded)',
    '14|multi': f'(multi-threaded{THREAD_MODE})',
}

def read_newest_json_file():
    files = [f for f in os.listdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), '../results'))]
    
    newest_file = None
    newest_time = None

    for file in files:
        try:
            timestamp_str = file.split('.')[0]
            file_time = datetime.strptime(timestamp_str, '%Y-%m-%dT%H-%M-%S')

            if newest_file is None or file_time > newest_time:
                newest_time = file_time
                newest_file = file
            
        except ValueError:
            print(f'{file} wird übersprungen...')

    return newest_file

def plot_performance_data():
    global JSON_FOLDER, JSON_FILE, FILTERS
    if not JSON_FILE:
        JSON_FILE = read_newest_json_file()

    output_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), f'../plots/{JSON_FILE.split('.')[0]}/')
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    with open(f'{JSON_FOLDER}{JSON_FILE}', 'r') as f:
        data = json.load(f)

    processed_data = {}
    for element in data['root_group']['groups']:
        _, app_name, benchmark_name = element['name'].replace('_multi', '|multi').split('_')
        if app_name not in processed_data:
            processed_data[app_name] = {}
        processed_data[app_name][benchmark_name] = element['metrics']
    
    all_benchmark_names = set()
    for app_data in processed_data.values():
        all_benchmark_names.update(app_data.keys())
    
    for benchmark_name in all_benchmark_names:
        benchmark_data = {}
        for app_name, app_data in processed_data.items():
            if benchmark_name in app_data:
                benchmark_data[app_name] = app_data[benchmark_name]
    
        all_stats = set()
        for app_name, app_benchmark_data in benchmark_data.items():
            all_stats.update(app_benchmark_data.keys())

        for stat_name in all_stats:
            if FILTERS and stat_name not in FILTERS:
                continue

            plt.figure(figsize=(12, 6))
            plt.title(f'{TITLES[stat_name]} für {TITLES[benchmark_name]}')
            plt.xlabel('Applikation')
            plt.ylabel(METRICS[stat_name])

            app_names = list(benchmark_data.keys())
            x_labels = []
            y_values = []
            colors = []

            for i, app_name in enumerate(app_names):
                if stat_name in benchmark_data[app_name]:
                    stat_data = benchmark_data[app_name][stat_name]

                    match stat_data['type']:
                        case 'trend':
                            x_labels.append(APPLICATIONS[app_name])
                            y_values.append(stat_data['values']['avg'])
                            colors.append(COLORS[i % len(COLORS)])

                        case 'counter':
                            x_labels.append(APPLICATIONS[app_name])
                            y_values.append(stat_data['values']['count'])
                            colors.append(COLORS[i % len(COLORS)])
                        
                        case 'rate':
                            x_labels.append(APPLICATIONS[app_name])
                            y_values.append(stat_data['values']['rate'])
                            colors.append(COLORS[i % len(COLORS)])
                        
                        case 'gauge':
                            x_labels.append(APPLICATIONS[app_name])
                            y_values.append(stat_data['values']['value'])
                            colors.append(COLORS[i % len(COLORS)])

                        case _:
                            print(f'unbekannter statistik-typ gefunden: {stat_data['type']} für {stat_name} in {app_name}|{benchmark_name}')

                if not x_labels:
                    print(f'keine werte zum plotten von {stat_name} für {app_name}|{benchmark_name} gefunden')
                    plt.close()
                    continue

            plt.bar(x_labels, y_values, color=colors)

            filename = f'{benchmark_name}_{stat_name}.png'
            filename = filename.replace('/', '_').replace('|', '_').replace('{', '_').replace('}', '_').replace(':true', '')
            filepath = os.path.join(output_dir, filename)

            plt.savefig(filepath)
            plt.close()
            print(f'plot in {output_dir} gespeichert')

plot_performance_data()