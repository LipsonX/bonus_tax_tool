// =================================
// Created by Lipson on 24-11-28.
// Email to LipsonChan@yahoo.com
// Copyright (c) 2024 Lipson. All rights reserved.
// Version 1.0
// =================================

const IncomeTaxBrackets = [
    {threshold: 0, rate: 0.03, deduction: 0},
    {threshold: 36000, rate: 0.1, deduction: 2520},
    {threshold: 144000, rate: 0.2, deduction: 16920},
    {threshold: 300000, rate: 0.25, deduction: 31920},
    {threshold: 420000, rate: 0.3, deduction: 52920},
    {threshold: 660000, rate: 0.35, deduction: 85920},
    {threshold: 960000, rate: 0.45, deduction: 181920}
];

function income_tax(total_income_in_tax) {
    let p_tax_result = 0;
    for (let i = IncomeTaxBrackets.length - 1; i >= 0; i--) {
        const bracket = IncomeTaxBrackets[i];
        if (total_income_in_tax > bracket.threshold) {
            p_tax_result = total_income_in_tax * bracket.rate - bracket.deduction;
            break;
        }
    }

    return p_tax_result;
}

const BonusTaxBrackets = [
    {threshold: 0, rate: 0.03, deduction: 0},
    {threshold: 36000, rate: 0.1, deduction: 210},
    {threshold: 144000, rate: 0.2, deduction: 1410},
    {threshold: 300000, rate: 0.25, deduction: 2660},
    {threshold: 420000, rate: 0.3, deduction: 4410},
    {threshold: 660000, rate: 0.35, deduction: 7160},
    {threshold: 960000, rate: 0.45, deduction: 15160}
];

function bonus_tax(b_tax) {
    let p_tax_result = 0;
    for (let i = BonusTaxBrackets.length - 1; i >= 0; i--) {
        const bracket = BonusTaxBrackets[i];
        if (b_tax > bracket.threshold) {
            p_tax_result = b_tax * bracket.rate - bracket.deduction;
            break;
        }
    }

    return p_tax_result;
}

const option = {
    title: {
        text: 'Bonus VS Consolidated Income',
        subtext: 'x means bonus'
    },
    xAxis: {data: []},
    yAxis: {},
    series: [
        {
            name: 'Tax',
            type: 'bar',
            stack: 'total',
            data: []
        }
    ]
};

const myChart = echarts.init(document.getElementById('main'));
const total_income_before_tax = document.getElementById('total_income_before_tax');
const total_tax_free = document.getElementById('total_tax_free');
const best_solution_text = document.getElementById('best_solution');
const tax_text = document.getElementById('tax');
const tax_bonus_text = document.getElementById('tax_bonus');
const tax_income_text = document.getElementById('tax_income');

function loadData() {
    const total = total_income_before_tax.value;
    const free = total_tax_free.value;
    option.xAxis.data = [];
    option.series[0].data = [];
    const total_income_in_tax = total - free;
    let min_tax = total;
    let best_bonus = 0;
    const step = 12000
    for (let x = 0; x <= total_income_in_tax; x += step) {
        option.xAxis.data.push(x);
        const itr_income = total_income_in_tax - x;
        const tax = income_tax(itr_income) + bonus_tax(x);
        option.series[0].data.push((tax).toFixed());

        if (min_tax > tax) {
            min_tax = tax;
            best_bonus = x;
        }
    }
    option.series[0].data[best_bonus / step] = {
        value: min_tax.toFixed(),
        itemStyle: {
            color: '#953333'
        }
    }
    option.yAxis = {min: Math.floor((min_tax * 0.9) / 10000) * 10000}

    myChart.setOption(option);
    best_solution_text.textContent = best_bonus.toFixed();
    tax_text.textContent = min_tax.toFixed();
    tax_bonus_text.textContent = bonus_tax(best_bonus).toFixed();
    tax_income_text.textContent = income_tax(total_income_in_tax - best_bonus).toFixed();
}

loadData();