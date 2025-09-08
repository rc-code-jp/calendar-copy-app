// 日本の祝日判定ライブラリ

/**
 * 日本の祝日を判定する関数
 * @param {Date} date - 判定する日付
 * @returns {boolean} 祝日の場合true
 */
const isJapaneseHoliday = function(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // 固定祝日
  const fixedHolidays = [
    [1, 1],   // 元日
    [2, 11],  // 建国記念の日
    [2, 23],  // 天皇誕生日
    [4, 29],  // 昭和の日
    [5, 3],   // 憲法記念日
    [5, 4],   // みどりの日
    [5, 5],   // こどもの日
    [8, 11],  // 山の日
    [11, 3],  // 文化の日
    [11, 23], // 勤労感謝の日
  ];

  // 固定祝日のチェック
  for (const [m, d] of fixedHolidays) {
    if (month === m && day === d) {
      return true;
    }
  }

  // 第2月曜日の祝日（成人の日、海の日、スポーツの日）
  const secondMonday = getSecondMonday(year, month);
  if (day === secondMonday) {
    if (month === 1 || month === 7 || month === 10) {
      return true;
    }
  }

  // 第3月曜日の祝日（敬老の日）
  const thirdMonday = getThirdMonday(year, month);
  if (month === 9 && day === thirdMonday) {
    return true;
  }

  // 春分の日・秋分の日（より正確な計算）
  if (month === 3) {
    const vernalEquinox = calculateVernalEquinox(year);
    if (day === vernalEquinox) {
      return true;
    }
  }

  if (month === 9) {
    const autumnalEquinox = calculateAutumnalEquinox(year);
    if (day === autumnalEquinox) {
      return true;
    }
  }

  // 振替休日のチェック
  if (isSubstituteHoliday(date)) {
    return true;
  }

  // 国民の休日のチェック
  if (isNationalHoliday(date)) {
    return true;
  }

  return false;
};

/**
 * 指定した年月の第2月曜日を取得
 * @param {number} year - 年
 * @param {number} month - 月
 * @returns {number} 第2月曜日の日付
 */
const getSecondMonday = function(year, month) {
  const firstDay = new Date(year, month - 1, 1);
  const firstDayOfWeek = firstDay.getDay();

  // 第1月曜日の日付を計算
  let firstMonday = 1;
  if (firstDayOfWeek === 0) {
    firstMonday = 2; // 日曜日の場合
  } else if (firstDayOfWeek === 1) {
    firstMonday = 1; // 月曜日の場合
  } else {
    firstMonday = 8 - firstDayOfWeek + 1; // その他の場合
  }

  // 第2月曜日は第1月曜日の7日後
  return firstMonday + 7;
};

/**
 * 指定した年月の第3月曜日を取得
 * @param {number} year - 年
 * @param {number} month - 月
 * @returns {number} 第3月曜日の日付
 */
const getThirdMonday = function(year, month) {
  const secondMonday = getSecondMonday(year, month);
  return secondMonday + 7;
};

/**
 * 春分の日を計算（より正確な計算式）
 * @param {number} year - 年
 * @returns {number} 春分の日の日付
 */
const calculateVernalEquinox = function(year) {
  if (year >= 1851 && year <= 1899) {
    return Math.floor(19.8277 + 0.242194 * (year - 1851) - Math.floor((year - 1851) / 4));
  } else if (year >= 1900 && year <= 1979) {
    return Math.floor(21.124 + 0.2422 * (year - 1900) - Math.floor((year - 1900) / 4));
  } else if (year >= 1980 && year <= 2099) {
    return Math.floor(20.8431 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4));
  } else if (year >= 2100 && year <= 2150) {
    return Math.floor(21.851 + 0.242194 * (year - 2100) - Math.floor((year - 2100) / 4));
  }
  // デフォルト値（概算）
  return 20;
};

/**
 * 秋分の日を計算（より正確な計算式）
 * @param {number} year - 年
 * @returns {number} 秋分の日の日付
 */
const calculateAutumnalEquinox = function(year) {
  if (year >= 1851 && year <= 1899) {
    return Math.floor(22.7020 + 0.2422 * (year - 1851) - Math.floor((year - 1851) / 4));
  } else if (year >= 1900 && year <= 1979) {
    return Math.floor(23.73 + 0.2422 * (year - 1900) - Math.floor((year - 1900) / 4));
  } else if (year >= 1980 && year <= 2099) {
    return Math.floor(23.2488 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4));
  } else if (year >= 2100 && year <= 2150) {
    return Math.floor(24.2488 + 0.242194 * (year - 2100) - Math.floor((year - 2100) / 4));
  }
  // デフォルト値（概算）
  return 23;
};

/**
 * 振替休日かどうかを判定
 * @param {Date} date - 判定する日付
 * @returns {boolean} 振替休日の場合true
 */
const isSubstituteHoliday = function(date) {
  // 月曜日でない場合は振替休日ではない
  if (date.getDay() !== 1) {
    return false;
  }

  // 前日（日曜日）が祝日かどうかをチェック
  const previousDay = new Date(date);
  previousDay.setDate(date.getDate() - 1);

  // 無限ループを避けるため、振替休日と国民の休日のチェックは除外
  return isBasicHoliday(previousDay);
};

/**
 * 国民の休日かどうかを判定
 * @param {Date} date - 判定する日付
 * @returns {boolean} 国民の休日の場合true
 */
const isNationalHoliday = function(date) {
  // 平日でない場合は国民の休日ではない
  if (date.getDay() === 0 || date.getDay() === 6) {
    return false;
  }

  // 前日と翌日が祝日かどうかをチェック
  const previousDay = new Date(date);
  previousDay.setDate(date.getDate() - 1);

  const nextDay = new Date(date);
  nextDay.setDate(date.getDate() + 1);

  // 無限ループを避けるため、基本的な祝日のみをチェック
  return isBasicHoliday(previousDay) && isBasicHoliday(nextDay);
};

/**
 * 基本的な祝日（振替休日・国民の休日を除く）かどうかを判定
 * @param {Date} date - 判定する日付
 * @returns {boolean} 基本的な祝日の場合true
 */
const isBasicHoliday = function(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // 固定祝日
  const fixedHolidays = [
    [1, 1],   // 元日
    [2, 11],  // 建国記念の日
    [2, 23],  // 天皇誕生日
    [4, 29],  // 昭和の日
    [5, 3],   // 憲法記念日
    [5, 4],   // みどりの日
    [5, 5],   // こどもの日
    [8, 11],  // 山の日
    [11, 3],  // 文化の日
    [11, 23], // 勤労感謝の日
  ];

  // 固定祝日のチェック
  for (const [m, d] of fixedHolidays) {
    if (month === m && day === d) {
      return true;
    }
  }

  // 第2月曜日の祝日（成人の日、海の日、スポーツの日）
  const secondMonday = getSecondMonday(year, month);
  if (day === secondMonday) {
    if (month === 1 || month === 7 || month === 10) {
      return true;
    }
  }

  // 第3月曜日の祝日（敬老の日）
  const thirdMonday = getThirdMonday(year, month);
  if (month === 9 && day === thirdMonday) {
    return true;
  }

  // 春分の日・秋分の日
  if (month === 3) {
    const vernalEquinox = calculateVernalEquinox(year);
    if (day === vernalEquinox) {
      return true;
    }
  }

  if (month === 9) {
    const autumnalEquinox = calculateAutumnalEquinox(year);
    if (day === autumnalEquinox) {
      return true;
    }
  }

  return false;
};

/**
 * 祝日名を取得する関数
 * @param {Date} date - 判定する日付
 * @returns {string|null} 祝日名、祝日でない場合はnull
 */
const getHolidayName = function(date) {
  if (!isJapaneseHoliday(date)) {
    return null;
  }

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // 固定祝日の名前マップ
  const fixedHolidayNames = {
    '1-1': '元日',
    '2-11': '建国記念の日',
    '2-23': '天皇誕生日',
    '4-29': '昭和の日',
    '5-3': '憲法記念日',
    '5-4': 'みどりの日',
    '5-5': 'こどもの日',
    '8-11': '山の日',
    '11-3': '文化の日',
    '11-23': '勤労感謝の日'
  };

  const key = `${month}-${day}`;
  if (fixedHolidayNames[key]) {
    return fixedHolidayNames[key];
  }

  // 第2月曜日の祝日
  const secondMonday = getSecondMonday(year, month);
  if (day === secondMonday) {
    if (month === 1) return '成人の日';
    if (month === 7) return '海の日';
    if (month === 10) return 'スポーツの日';
  }

  const thirdMonday = getThirdMonday(year, month);
  if (month === 9 && day === thirdMonday) {
    return '敬老の日';
  }

  // 春分の日・秋分の日
  if (month === 3 && day === calculateVernalEquinox(year)) {
    return '春分の日';
  }

  if (month === 9 && day === calculateAutumnalEquinox(year)) {
    return '秋分の日';
  }

  // 振替休日・国民の休日
  if (isSubstituteHoliday(date)) {
    return '振替休日';
  }

  if (isNationalHoliday(date)) {
    return '国民の休日';
  }

  return '祝日';
};
