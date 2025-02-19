const holidays = [
	{ name: '元旦', month: 0, day: 1, lunar: false },
	{ name: '春节', month: 0, day: 1, lunar: true },
	{ name: '清明节', month: 3, day: 4, lunar: false },
	{ name: '劳动节', month: 4, day: 1, lunar: false },
	{ name: '端午节', month: 4, day: 5, lunar: true },
	{ name: '高考', month: 5, day: 7, lunar: false },
	{ name: '中考', month: 5, day: 20, lunar: false },
	{ name: '中秋节', month: 7, day: 15, lunar: true },
	{ name: '国庆节', month: 9, day: 1, lunar: false },
];

const today = new Date();
const threeYearsLater = new Date(today);
threeYearsLater.setFullYear(today.getFullYear() + 3);

const upcomingHolidays = [];

for (let year = today.getFullYear(); year <= threeYearsLater.getFullYear(); year++) {
	holidays.forEach((holiday) => {
		let holidayDate;
		if (holiday.lunar) {
			const lunarDate = Lunar.fromYmd(year, holiday.month + 1, holiday.day).getSolar();
			holidayDate = new Date(lunarDate.getYear(), lunarDate.getMonth() - 1, lunarDate.getDay());
		} else {
			holidayDate = new Date(year, holiday.month, holiday.day);
		}
		if (holidayDate >= today && holidayDate <= threeYearsLater) {
			const formattedDate = `${holidayDate.getFullYear()}-${String(holidayDate.getMonth() + 1).padStart(2, '0')}-${String(
				holidayDate.getDate()
			).padStart(2, '0')}`;
			upcomingHolidays.push({ name: holiday.name, date: formattedDate });
		}
	});
}

let currentHolidayIndex = 0;

function updateCountdown() {
	const now = new Date();
	const holiday = new Date(upcomingHolidays[currentHolidayIndex].date);
	const diffTime = holiday - now;
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	document.getElementById('countdown').innerHTML = `距离 <strong>${holiday.getFullYear()}年${
		upcomingHolidays[currentHolidayIndex].name
	}</strong> 还有 <strong>${diffDays}</strong> 天`;
}

function createHolidayList() {
	const holidayList = document.getElementById('holiday-list');
	upcomingHolidays.forEach((holiday, index) => {
		const li = document.createElement('li');
		li.innerText = `${holiday.date} ${holiday.name}`;
		li.addEventListener('click', () => {
			document.querySelectorAll('#holiday-list li').forEach((li) => li.classList.remove('selected'));
			li.classList.add('selected');
			currentHolidayIndex = index;
			updateCountdown();
			li.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
		});
		if (index === currentHolidayIndex) {
			li.classList.add('selected');
		}
		holidayList.appendChild(li);
	});
}

function updateCurrentTime() {
	const now = new Date();
	const formattedTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(
		now.getHours()
	).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
	document.getElementById('current-time').innerText = formattedTime;
}

document.addEventListener('DOMContentLoaded', () => {
	createHolidayList();
	updateCountdown();
	setInterval(updateCountdown, 86400000); // 每天更新一次倒计时
	setInterval(updateCurrentTime, 1000); // 每秒更新一次当前时间

	// 设置当前年份
	document.getElementById('current-year').innerText = new Date().getFullYear();
});
