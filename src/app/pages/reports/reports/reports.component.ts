import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { Category } from "../../categories/shared/category.model";
import { CategoryService } from '../../categories/shared/category.service';
import { Entry } from "../../entries/shared/entry.model";
import { EntryService } from '../../entries/shared/entry.service';

import currencyFormatter from 'currency-formatter';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  totalExpense: any = 0;
  totalRevenue: any = 0;
  balance: any = 0;

  expenseChartData: any
  revenueChartData: any;

  chartOptions = {
    scales: {
      yAxis: [{
        ticks: { beginAtZero: true }
      }]
    }
  }

  categories: Category[] = []
  entries: Entry[] = []

  @ViewChild('month') month: ElementRef = null
  @ViewChild('year') year: ElementRef = null

  constructor(private categoryService: CategoryService, private entryService: EntryService) { }

  ngOnInit() {
    this.categoryService.getAll().subscribe(
      categories => this.categories = categories
    )
  }

  generateReports() {
    const month = this.month.nativeElement.value;
    const year = this.year.nativeElement.value;

    if (!month || !year) {
      alert('Você precisa selecionar o mes e o ano para gera os relatórios')
    } else {
      this.entryService.getByMonthAndYear(month, year).subscribe(this.setValues.bind(this))
    }
  }

  private setValues(entries: Entry[]) {
    this.entries = entries
    this.calculateBalance()
    this.setChartData()
  }

  private calculateBalance() {
    let totalExpense = 0
    let totalRevenue = 0

    this.entries.forEach(entry => {
      if (entry.type == 'revenue') {
        return totalRevenue += currencyFormatter.unformat(entry.amount, { code: 'BRL' })
      } else {
        return totalExpense += currencyFormatter.unformat(entry.amount, { code: 'BRL' })
      }
    })

    this.totalExpense = currencyFormatter.format(totalExpense, { code: 'BRL' })
    this.totalRevenue = currencyFormatter.format(totalRevenue, { code: 'BRL' })
    this.balance = currencyFormatter.format(totalRevenue - totalExpense, { code: 'BRL' })
  }

  private setChartData() {
    this.revenueChartData = this.getChartData('revenue', 'Gráfico de Receitas', '#9CCC65')
    this.expenseChartData = this.getChartData('expense', 'Gráfico de Despesas', '#E03131')
  }

  private getChartData(entryType: string, title: string, color: string) {
    const chartData = []

    this.categories.forEach(category => {
      //filtering entries by category and type
      const filteredEntries = this.entries.filter(
        entry => (entry.categoryId == category.id) && (entryType)
      )

      //if found entries, sum entries amount and add to chardData
      if (filteredEntries.length > 0) {
        const totalAmount = filteredEntries.reduce((total, entry) =>
          total + currencyFormatter.unformat(entry.amount, { code: 'BRL' }), 0
        )

        chartData.push({
          categoryName: category.name,
          totalAmount: totalAmount
        })
      }
    })

    return {
      labels: chartData.map(item => item.categoryName),
      datasets: [{
        label: title,
        backgroundColor: color,
        data: chartData.map(item => item.totalAmount)
      }]
    }
  }

}
