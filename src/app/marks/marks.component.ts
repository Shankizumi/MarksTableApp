import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as echarts from 'echarts';

@Component({
  selector: 'app-marks',
  imports: [CommonModule, FormsModule],
  templateUrl: './marks.component.html',
  styleUrl: './marks.component.css',
})
export class MarksComponent implements OnInit {
  showModal: boolean = false;
  showchartModal = false;
  showRowModal: boolean = false;

  newStudent: any = {
    name: '',
    physics: '',
    math: '',
    chemistry: '',
    english: '',
    hindi: '',
  };

  showUpdateModal: boolean = false;
  selectedStudent: any = {};
  selectedIndex: number | null = null;
  selectedRowStudent: any = null;

  students = [
    {
      name: 'Rohan Rathod',
      physics: 85,
      math: 90,
      chemistry: 78,
      english: 88,
      hindi: 92,
    },
    {
      name: 'Eren Jeager',
      physics: 72,
      math: 75,
      chemistry: 80,
      english: 85,
      hindi: 88,
    },
    {
      name: 'Alice Borderland',
      physics: 90,
      math: 88,
      chemistry: 85,
      english: 92,
      hindi: 89,
    },
  ];

  ngOnInit(): void {
    const storedData = sessionStorage.getItem('students');
    if (storedData) {
      this.students = JSON.parse(storedData);
    } else {
      this.updateSessionStorage();
    }
  }

  updateSessionStorage() {
    sessionStorage.setItem('students', JSON.stringify(this.students));
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.resetForm();
  }

  addStudent() {
    const { name, physics, math, chemistry, english, hindi } = this.newStudent;

    // Validation for all fields
    if (!name || !physics || !math || !chemistry || !english || !hindi) {
      alert('Please fill all the fields!');
      return;
    }

    // Validation for marks
    if (
      physics < 0 ||
      physics > 100 ||
      math < 0 ||
      math > 100 ||
      chemistry < 0 ||
      chemistry > 100 ||
      english < 0 ||
      english > 100 ||
      hindi < 0 ||
      hindi > 100
    ) {
      alert('Marks should be between 0 and 100 for all subjects.');
      return;
    }

    // Add student to the list
    this.students.push({ ...this.newStudent });
    this.closeModal();
    this.updateSessionStorage();
  }

  resetForm() {
    this.newStudent = {
      name: '',
      physics: '',
      math: '',
      chemistry: '',
      english: '',
      hindi: '',
    };
  }

  openUpdateModal(student: any, index: number) {
    this.selectedStudent = { ...student };
    this.selectedIndex = index;
    this.showUpdateModal = true;
  }

  closeUpdateModal() {
    this.showUpdateModal = false;
    this.selectedStudent = {};
    this.selectedIndex = null;
  }

  // Update the student's data
  updateStudent(index: number | null) {
    if (index === null) return;

    const { name, physics, math, chemistry, english, hindi } =
      this.selectedStudent;

    // Validation for all fields
    if (!name || !physics || !math || !chemistry || !english || !hindi) {
      alert('Please fill all the fields!');
      return;
    }

    // Validation for marks
    if (
      physics < 0 ||
      physics > 100 ||
      math < 0 ||
      math > 100 ||
      chemistry < 0 ||
      chemistry > 100 ||
      english < 0 ||
      english > 100 ||
      hindi < 0 ||
      hindi > 100
    ) {
      alert('Marks should be between 0 and 100 for all subjects.');
      return;
    }

    // Update the student data
    this.students[index] = { ...this.selectedStudent };
    this.closeUpdateModal();
  }

  deleteStudent(index: number) {
    console.log(`Delete button clicked for student at index ${index}`);
    this.students.splice(index, 1);
    this.updateSessionStorage();
  }

  openChartModal() {
    this.showchartModal = true;

    // Used a short delay to ensure the DOM is fully rendered before initializing the chart
    setTimeout(() => {
      this.renderChart();
    }, 0);
  }

  closeChartModal() {
    this.showchartModal = false;
  }

  renderChart() {
    const chartDom = document.getElementById('chart')!;
    const myChart = echarts.init(chartDom);

    // Calculate total marks for each student
    const studentNames = this.students.map((student) => student.name);
    const totalMarks = this.students.map((student) => {
      return (
        student.physics +
        student.math +
        student.chemistry +
        student.english +
        student.hindi
      );
    });

    // Configure the chart
    const option = {
      title: {
        text: 'Overall Performance',
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
      },
      xAxis: {
        type: 'category',
        data: studentNames,
        axisLabel: { rotate: 30, interval: 0 },
      },
      yAxis: {
        type: 'value',
        max: 500, // Max total marks (100 * 5 subjects)
      },
      series: [
        {
          data: totalMarks,
          type: 'bar',
          barWidth: '50%',
          itemStyle: { color: '#42A5F5' },
        },
      ],
    };

    // Set the options
    myChart.setOption(option);
  }

  viewRowChart(index: number) {
    this.selectedRowStudent = this.students[index];
    this.showRowModal = true;
    setTimeout(() => this.renderRowChart(), 0);
  }

  closeRowModal() {
    this.showRowModal = false;
    this.selectedRowStudent = null;
  }

  renderRowChart() {
    // This function is for rendering the chart
    const chartDom = document.getElementById('row-chart');
    if (!chartDom) {
      console.error('Chart container not found');
      return;
    }

    const myChart = echarts.init(chartDom);
    const { physics, math, chemistry, english, hindi } =
      this.selectedRowStudent;
    const totalMarks = physics + math + chemistry + english + hindi;
    const remainingMarks = 500 - totalMarks;

    const option = {
      title: {
        text: 'Marks Distribution',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          name: 'Marks',
          type: 'pie',
          radius: '50%',
          data: [
            { value: physics, name: 'Physics' },
            { value: math, name: 'Math' },
            { value: chemistry, name: 'Chemistry' },
            { value: english, name: 'English' },
            { value: hindi, name: 'Hindi' },
            {
              value: remainingMarks,
              name: 'Remaining',
              itemStyle: { color: '#d3d3d3' },
            },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };

    myChart.setOption(option);
  }
}
