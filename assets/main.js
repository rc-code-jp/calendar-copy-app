const weeks = ['日', '月', '火', '水', '木', '金', '土']

const $calendar = document.querySelector('#calendar');
const $output = document.querySelector('#output');

window.onload = function() {
  const dateArray = getDayArray();

  // 年月をキーにして2重配列にする
  const dateArrayMap = dateArray.reduce((acc, day) => {
    const key = day.getFullYear() + '年' + (day.getMonth() + 1) + '月';
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(day);
    return acc;
  }, {});


  // カレンダー表示
  $calendar.innerHTML = Object.keys(dateArrayMap).map(key => {
    return `
      <div class="calendar-month">
        <h3>${key}</h3>
        <ul class="calendar-day-list">
          ${dateArrayMap[key].map(date => {
            const value = formatDate(date);
            return `<li class="week-${date.getDay()}">
              <label>
                <input type="checkbox" name="day" value="${value}">
                <span>${value}</span>
              </label>
            </li>`;
          }).join('')}
        </ul>
      </div>
    `;
  }
  ).join('');

  // チェックした日付を表示
  $calendar.addEventListener('change', function() {
    const checkedDays = Array.from(document.querySelectorAll('input[name="day"]:checked')).map(day => day.value);

    // 昇順にソート
    checkedDays.sort();

    // 表示する
    $output.textContent = checkedDays.join('\n');

    // コピーする
    const copyText = document.createElement('textarea');
    copyText.value = checkedDays.join('\n');
    document.body.appendChild(copyText);
    copyText.select();
    document.execCommand('copy');
    document.body.removeChild(copyText);
  });
}

// 日付を取得
const getDayArray = function () {
  // 今月の1日から3ヶ月分の日付の一覧を取得
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 3, 0);
  const days = [];
  for (let i = firstDay; i <= lastDay; i.setDate(i.getDate() + 1)) {
    const date = new Date(i);
    days.push(date);
  }
  return days;
} 

// 日付はYYYY/MM/DD（曜日）の形式で返す
const formatDate = function (date) {
  const weekNumber = date.getDay();
  // 日付が1桁の場合は0埋めする
  const m = ('0' +(date.getMonth() + 1)).slice(-2);
  const d = ('0' + date.getDate()).slice(-2);
  return date.getFullYear() + '/' + m + '/' + d + '（' + weeks[weekNumber] + '）'
}