const weeks = ['日', '月', '火', '水', '木', '金', '土']

const $calendar = document.querySelector('#calendar');
const $output = document.querySelector('#output');

window.onload = function() {
  const days = getDays();

  // 日付の先頭7文字をキーにして2重配列にする
  const daysMap = days.reduce((acc, day) => {
    const key = day.slice(0, 7);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(day);
    return acc;
  }, {});

  // カレンダー表示
  $calendar.innerHTML = Object.keys(daysMap).map(key => {
    return `
      <div class="calendar-month">
        <h3>${key}</h3>
        <ul class="calendar-day-list">
          ${daysMap[key].map(day => `<li>
            <label>
              <input type="checkbox" name="day" value="${day}">
              <span>${day}</span>
            </label>
          </li>`).join('')}
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
const getDays = function () {
  // 今月の1日から3ヶ月分の日付の一覧を取得
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 3, 0);
  const days = [];
  for (let i = firstDay; i <= lastDay; i.setDate(i.getDate() + 1)) {
    // 日付はYYYY/MM/DD（曜日）の形式で取得
    const date = new Date(i);
    const dayNumber = date.getDay();
    // 日付が1桁の場合は0埋めする
    const m = ('0' +(date.getMonth() + 1)).slice(-2);
    const d = ('0' + date.getDate()).slice(-2);
    days.push(date.getFullYear() + '/' + m + '/' + d + '（' + weeks[dayNumber] + '）');
  }
  return days;
} 