const compList = document.querySelector('#competition-list');
const filterBtns = document.querySelector('#filter-buttons');
const chartBox = document.querySelector('#chart-container');

let allComps = [];
let statsData = null;

const renderCards = (data) => {
  compList.innerHTML = '';
  if (data.length === 0) {
    compList.innerHTML = '<div class="col-12"><p class="alert alert-info">暂无相关竞赛数据</p></div>';
    return;
  }
  data.forEach(item => {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-6';
    col.innerHTML = `
      <div class="card h-100 shadow-sm border-0 bg-white">
        <div class="card-body">
          <h5 class="card-title text-primary fw-bold">${item.name}</h5>
          <p class="card-text mb-2 mt-3">
            <span class="badge bg-secondary me-2">${item.type}</span>
            <span class="badge bg-info text-dark">${item.level}</span>
          </p>
          <p class="card-text text-muted small mt-auto">当前状态: ${item.status}</p>
        </div>
      </div>
    `;
    compList.appendChild(col);
  });
};

filterBtns.addEventListener('click', (e) => {
  if (e.target.tagName !== 'BUTTON') return;
  
  document.querySelectorAll('#filter-buttons button').forEach(btn => {
    btn.className = 'btn btn-outline-primary';
  });
  e.target.className = 'btn btn-primary';

  const type = e.target.dataset.type;
  if (type === 'all') {
    renderCards(allComps);
  } else {
    renderCards(allComps.filter(c => c.type === type));
  }
});

const initCharts = (stats) => {
  chartBox.innerHTML = `
    <div id="bar-chart" style="width:50%; height:100%; float:left;"></div>
    <div id="pie-chart" style="width:50%; height:100%; float:left;"></div>
  `;

  const barChart = echarts.init(document.getElementById('bar-chart'));
  barChart.setOption({
    title: { text: '历年核心赛事人数', left: 'center', textStyle: { fontSize: 15 } },
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0 },
    xAxis: { data: stats.categories },
    yAxis: { name: '人次' },
    series: [
      { name: 'CMC数学竞赛', type: 'bar', data: stats.cmcParticipants },
      { name: '蓝桥杯', type: 'bar', data: stats.lanqiaoParticipants }
    ]
  });

  const pieChart = echarts.init(document.getElementById('pie-chart'));
  pieChart.setOption({
    title: { text: '竞赛大类占比', left: 'center', textStyle: { fontSize: 15 } },
    tooltip: { trigger: 'item' },
    series: [{
      name: '竞赛数量',
      type: 'pie',
      radius: '55%',
      data: [
        { value: 2, name: '计算机类' },
        { value: 1, name: '理科类' },
        { value: 1, name: '商科类' }
      ]
    }]
  });

  window.addEventListener('resize', () => {
    barChart.resize();
    pieChart.resize();
  });
};

const loadData = async () => {
  chartBox.innerHTML = '<p class="text-muted text-center mt-5">数据加载中...</p>';
  try {
    const res = await fetch('data/data.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    
    allComps = data.competitions;
    statsData = data.stats;
    
    renderCards(allComps);
    initCharts(statsData);
  } catch (err) {
    compList.innerHTML = '<div class="col-12"><p class="alert alert-danger">竞赛列表加载失败，请检查网络状态</p></div>';
    chartBox.innerHTML = '<div class="alert alert-danger w-100 text-center mt-5">图表数据加载失败，请重试</div>';
  }
};

loadData();