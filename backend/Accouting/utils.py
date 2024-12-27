import matplotlib.pyplot as plt
import io
from django.http import HttpResponse

class PieChartGenerator:
    @staticmethod
    def create_pie_chart(categories, amounts, title="Pie Chart"):
        if not categories or not amounts:
            raise ValueError("Categories and amounts cannot be empty.")
        
        # Generate the pie chart
        plt.figure(figsize=(6, 6))
        plt.pie(amounts, labels=categories, autopct='%1.1f%%', startangle=140, colors=plt.cm.tab10.colors)
        plt.title(title)

        # Save to buffer
        buffer = io.BytesIO()
        plt.savefig(buffer, format='png')
        buffer.seek(0)
        plt.close()
        return buffer
