import json
import matplotlib.pyplot as plt
import os

JSON_FILE = 'results/scenarios-copy.json'
FILTERS = []

COLORS = ['blue', 'green', 'red', 'purple', 'orange', 'brown', 'pink', 'gray', 'olive', 'cyan']

APPLICATIONS = {
    '3000': 'Express.js',
    '3001': 'Fastify',
    '3002': 'JAX-RS',
    '3003': 'HttpServlet'
}

def plot_performance_data(json_file_path, filter_keys=[]):
    output_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../plots')
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    with open(json_file_path, 'r') as f:
        data = json.load(f)

    processed_data = {}
    for key, value in data.items():
        app_name, _, benchmark_name = key.partition('/')
        if app_name not in processed_data:
            processed_data[app_name] = {}
        processed_data[app_name][benchmark_name] = value
    
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
            if filter_keys and stat_name not in filter_keys:
                continue

            plt.figure(figsize=(12, 6))
            plt.title(f'{stat_name} für Benchmark {benchmark_name}')
            plt.xlabel('Applikation')
            plt.ylabel(stat_name)

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
            plt.legend([x for x in APPLICATIONS.values()])

            filename = f'{benchmark_name}_{stat_name}.png'
            filename = filename.replace('/', '_').replace('{', '_').replace('}', '_').replace(':true', '')
            filepath = os.path.join(output_dir, filename)

            plt.savefig(filepath)
            plt.close()
            print(f'plot in {output_dir} gespeichert')

plot_performance_data(json_file_path=JSON_FILE, filter_keys=FILTERS)