// 等待 Lunar 加载完成
window.state = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  day: new Date().getDate()
};

// 移除 window.addEventListener('load', initApp);

function initApp() {
  console.log('initApp started');
  if (typeof window.Lunar === 'undefined') {
    console.log('Lunar not loaded, retrying...');
    setTimeout(initApp, 100);
    return;
  }
  console.log('Lunar loaded, initializing...');
  console.log('Lunar object:', window.Lunar);

  // 渲染函数
  window.render = function () {
    try {
      // 直接使用 window.Lunar 的方法
      const lunar = window.Lunar.fromYmd(window.state.year, window.state.month, window.state.day);
      const solar = lunar.getSolar(); // 使用 lunar 对象获取 solar

      // 更新年月日显示
      document.querySelector('.left-panel .row:nth-child(1) .label').textContent = lunar.getYearInGanZhi() + '年';
      document.querySelector('.left-panel .row:nth-child(1) div:nth-child(2)').textContent = `属${lunar.getYearShengXiao()}`;
      document.querySelector('.left-panel .row:nth-child(1) div:nth-child(3)').textContent = lunar.getYearNaYin();

      document.querySelector('.left-panel .row:nth-child(2) .label').textContent = lunar.getMonthInGanZhi() + '月';
      document.querySelector('.left-panel .row:nth-child(2) div:nth-child(2)').textContent = `属${lunar.getMonthShengXiao()}`;
      document.querySelector('.left-panel .row:nth-child(2) div:nth-child(3)').textContent = lunar.getMonthNaYin();

      document.querySelector('.left-panel .row:nth-child(3) .label').textContent = lunar.getDayInGanZhi() + '日';
      document.querySelector('.left-panel .row:nth-child(3) div:nth-child(2)').textContent = `属${lunar.getDayShengXiao()}`;
      document.querySelector('.left-panel .row:nth-child(3) div:nth-child(3)').textContent = lunar.getDayNaYin();

      // 更新中间面板日期显示
      const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
      const weekDay = weekDays[solar.getWeek()];

      document.querySelector('.date-display div:first-child').textContent =
        `公历 ${state.year}年 ${state.month}月 ${state.day}日 星期${weekDay} ${solar.getXingZuo()}座`;

      document.querySelector('.date-display .today span').textContent = state.day;

      document.querySelector('.date-display .lunar').textContent =
        `农历 ${lunar.getYearInChinese()}年 ${lunar.getMonthInChinese()}月 ${lunar.getDayInChinese()}`;


      const jieQiList = lunar.getJieQiList();

      // 查找当前日期的前后节气
      let prevJieQi = null;
      let nextJieQi = null;
      const currentDate = `${state.year}-${String(state.month).padStart(2, '0')}-${String(state.day).padStart(2, '0')}`;



      // 遍历所有节气，找到最近的前一个和后一个节气
      for (let i = 0; i < jieQiList.length; i++) {
        const jieQi = lunar._p.jieQi[jieQiList[i]];
        if (jieQi) {
          const jieQiDate = window.Solar.fromYmd(jieQi._p.year, jieQi._p.month, jieQi._p.day);
          const jieQiYmd = `${jieQiDate.getYear()}-${String(jieQiDate.getMonth()).padStart(2, '0')}-${String(jieQiDate.getDay()).padStart(2, '0')}`;

          if (jieQiYmd <= currentDate) {
            prevJieQi = {
              name: jieQiList[i],
              date: jieQiDate
            };
          } else {
            nextJieQi = {
              name: jieQiList[i],
              date: jieQiDate
            };
            break;
          }
        }
      }

      // 更新节气显示
      if (prevJieQi) {
        document.getElementById('prevJieQi').innerHTML = `节气${prevJieQi.name}：${prevJieQi.date.toYmd()} 星期${weekDays[prevJieQi.date.getWeek()]}`
        //$('#prevJieQi').html(`节气${prevJieQi.name}：${prevJieQi.date.toYmd()} 星期${weekDays[prevJieQi.date.getWeek()]}`);
      }
      if (nextJieQi) {
        document.getElementById('nextJieQi').innerHTML = `节气${nextJieQi.name}：${nextJieQi.date.toYmd()} 星期${weekDays[nextJieQi.date.getWeek()]}`
        // $('#nextJieQi').html(`节气${nextJieQi.name}：${nextJieQi.date.toYmd()} 星期${weekDays[nextJieQi.date.getWeek()]}`);
      }
      // 更新宜忌
      const yinli = lunar.getDayYi();
      const yi = document.querySelector('.yj-container .yi + ul');
      if (yi) {
        yi.innerHTML = yinli.map(item => `<li>${item}</li>`).join('');
      }

      const jinli = lunar.getDayJi();
      const ji = document.querySelector('.yj-container .ji + ul');
      if (ji) {
        ji.innerHTML = jinli.map(item => `<li>${item}</li>`).join('');
      }


      const pengZuGan = lunar.getPengZuGan(); // 获取日干的彭祖百忌
      const pengZuZhi = lunar.getPengZuZhi(); // 获取日支的彭祖百忌

      console.log('Nine Star Type:', pengZuGan);
      document.getElementById('pengzu').innerHTML = pengZuGan;
      document.getElementById('baiji').innerHTML = pengZuZhi;


      const nineStar = lunar.getDayNineStar();

      const jishen = lunar.getDayJiShen()
      $('#jishen').html(jishen.map(item => `<li  style="width:30%;margin-left: 5px;"> ${item} </li>`).join(''));

      const xiongSha = lunar.getDayXiongSha();
      $('#xiongsha').html(xiongSha.map(item => `<li  style="width:30%"> ${item} </li>`).join(''));

      $('#yueming').html(lunar.getJieQi())
      $('#wuhou').html(lunar.getHou())
      $('#yuexiang').html(lunar.getYueXiang())

      const dayChong = `${lunar.getDayShengXiao()}日冲(${lunar.getDayChongGan()}${lunar.getDayChong()})${lunar.getDayChongShengXiao()}`;

      $('#xiangchong').html(dayChong)
      const monthZhi = lunar.getMonthZhi();
      // 获取月支对应的偏移量
      const offset = LunarUtil.ZHI_TIAN_SHEN_OFFSET[monthZhi];
      // 计算日支索引加上偏移量，再取余12后加1，得到值神索引
      const index = (lunar._p.dayZhiIndex + offset) % 12 + 1;
      // 从值神表中获取对应的值神
      const tianShen = LunarUtil.TIAN_SHEN[index];

      $('#zhishen').html(tianShen)


      // 获取月支
      const offset12 = LunarUtil.ZHI_TIAN_SHEN_OFFSET[monthZhi]; // 获取偏移值
      const tianShen12 = LunarUtil.TIAN_SHEN[(lunar._p.dayZhiIndex + offset12) % 12 + 1];
      const tianShenType = LunarUtil.TIAN_SHEN_TYPE[tianShen12];
      $('#shen12').html(`${tianShen12}（${tianShenType}日）`);





      $('#yuexiang').html(lunar.getYueXiang())

      // 获取胎神信息
      const monthTaiShen = lunar.getMonthPositionTai(); // 本月胎神
      const dayTaiShen = lunar.getDayPositionTai();     // 今日胎神
      $('#monthTaiShen').html(monthTaiShen);
      $('#dayTaiShen').html(dayTaiShen);

      // 获取岁煞
      const suiSha = lunar.getYearSuiSha();
      $('#suiSha').html(suiSha);

      // 获取六曜
      const liuYao = lunar.getDayLiuYao();
      $('#liuYao').html(liuYao);

      // 获取日禄
      const dayLu = lunar.getDayLu();
      $('#dayLu').html(dayLu);










      // 更新吉神方位
      const xiPosition = document.querySelector('.grid-item:nth-child(1) .row:nth-child(1) span:last-child');
      const fuPosition = document.querySelector('.grid-item:nth-child(1) .row:nth-child(2) span:last-child');
      const caiPosition = document.querySelector('.grid-item:nth-child(1) .row:nth-child(3) span:last-child');





      if (xiPosition) xiPosition.textContent = lunar.getDayPositionXi();
      if (fuPosition) fuPosition.textContent = lunar.getDayPositionFu();
      if (caiPosition) caiPosition.textContent = lunar.getDayPositionCai();

      console.log('渲染完成:', { lunar, solar });
    } catch (error) {
      console.error('渲染出错:', error);
      console.log('错误详情:', {
        lunarObject: window.Lunar,
        state: window.state
      });
    }
  }

  // 初始化月份选择
  const monthSelect = document.getElementById('monthInput');
  if (monthSelect) {
    monthSelect.innerHTML = ''; // 清空现有选项
    for (let i = 1; i <= 12; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.text = i;
      monthSelect.appendChild(option);
    }
  }

  // 设置初始值
  const yearInput = document.getElementById('yearInput');
  const dayInput = document.getElementById('dayInput');
  console.log('Current state:', window.state); // 添加调试日志

  if (yearInput) yearInput.value = window.state.year;
  if (monthSelect) monthSelect.value = window.state.month;
  if (dayInput) dayInput.value = window.state.day;

  // 添加事件监听
  if (yearInput) {
    yearInput.addEventListener('change', function () {
      state.year = parseInt(this.value);
      render();
    });
  }

  if (monthSelect) {
    monthSelect.addEventListener('change', function () {
      state.month = parseInt(this.value);
      render();
    });
  }

  if (dayInput) {
    dayInput.addEventListener('change', function () {
      state.day = parseInt(this.value);
      render();
    });
  }

  // 添加上一天下一天的点击事件
  document.querySelector('.prev')?.addEventListener('click', () => prevDay());
  document.querySelector('.next')?.addEventListener('click', () => nextDay());

  // 初始渲染
  render();

  // 将render函数暴露到全局作用域
  window.render = render;
}

// 上一天下一天的处理函数
// 上一天
window.prevDay = function () {
  if (!window.Lunar) return;
  const lunar = window.Lunar.fromYmd(window.state.year, window.state.month, window.state.day);
  const prev = lunar.next(-1);
  window.state.year = prev.getYear();
  window.state.month = prev.getMonth();
  window.state.day = prev.getDay();

  // 更新输入框的值
  document.getElementById('yearInput').value = window.state.year;
  document.getElementById('monthInput').value = window.state.month;
  document.getElementById('dayInput').value = window.state.day;

  window.render();
}

// 下一天
window.nextDay = function () {
  if (!window.Lunar) return;
  const lunar = window.Lunar.fromYmd(window.state.year, window.state.month, window.state.day);
  const next = lunar.next(1);
  window.state.year = next.getYear();
  window.state.month = next.getMonth();
  window.state.day = next.getDay();

  // 更新输入框的值
  document.getElementById('yearInput').value = window.state.year;
  document.getElementById('monthInput').value = window.state.month;
  document.getElementById('dayInput').value = window.state.day;

  window.render();
}

// 启动应用
window.addEventListener('load', initApp);