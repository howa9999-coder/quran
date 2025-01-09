
// Get the current date and time
const today = new Date();

// Extract the day, month, and year
const day = today.getDate();
const monthIndex = today.getMonth(); // Returns 0 for January, 1 for February, etc.
const year = today.getFullYear();

// Get current time in HH:mm format
const currentTime = today.getHours() * 60 + today.getMinutes(); // Convert time to minutes

// Array of month names
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Get the name of the current month
const monthName = monthNames[monthIndex];

const formattedDate = `${day}-${monthName}-${year}`;
const formattedDate2 = `${day}/${monthIndex + 1}/${year}`;
document.querySelector('.date').innerHTML = `${formattedDate2}`;

function getCities() {
    axios.get(`https://habous-prayer-times-api.onrender.com/api/v1/available-cities`)
    .then(function (response) {
        let cities = response.data.cities;
        cities.forEach(city => {
            document.querySelector("#cities").innerHTML += `
                <option value="${city.id}">${city.arabicCityName}</option>
            `;
        });
        const savedCity = localStorage.getItem("cityId") || 58
        if (savedCity) {
            document.querySelector('#cities').value = savedCity; // Set the select input to the saved value
        }
    });
}

getCities();

function salahTimming(cityId) {
    axios.get(`https://habous-prayer-times-api.onrender.com/api/v1/prayer-times?cityId=${cityId}`)
    .then(function (response) {
        const citydata = response.data.data.timings;
        citydata.forEach(element => {
            const date = element.date.gregorian;
            const dayDate = `${date.day}-${date.month}-${date.year}`;
            if (formattedDate === dayDate) {
                const fajrTime = convertToMinutes(element.prayers.fajr);
                const dhuhrTime = convertToMinutes(element.prayers.dhuhr);
                const asrTime = convertToMinutes(element.prayers.asr);
                const maghribTime = convertToMinutes(element.prayers.maghrib);
                const ishaTime = convertToMinutes(element.prayers.ishaa);

                // Display prayer times
                document.querySelector('#fajr').innerHTML = `${element.prayers.fajr}`;
                document.querySelector('#dhuhr').innerHTML = `${element.prayers.dhuhr}`;
                document.querySelector('#asr').innerHTML = `${element.prayers.asr}`;
                document.querySelector('#maghrib').innerHTML = `${element.prayers.maghrib}`;
                document.querySelector('#isha').innerHTML = `${element.prayers.ishaa}`;

                // Highlight current prayer
                highlightCurrentPrayer(fajrTime, dhuhrTime, asrTime, maghribTime, ishaTime);
            }
        });
    });
}

// Convert prayer time to minutes for comparison
function convertToMinutes(time) {
    const [hour, minute] = time.split(':');
    return parseInt(hour) * 60 + parseInt(minute);
}

// Highlight current prayer

function highlightCurrentPrayer(fajrTime, dhuhrTime, asrTime, maghribTime, ishaTime) {
    const body = document.querySelector('body')
        if (currentTime >= fajrTime && currentTime < dhuhrTime) {
            body.classList.add('fajr');
        } else if (currentTime >= dhuhrTime && currentTime < asrTime) {
            body.classList.add('dhuhr');
        } else if (currentTime >= asrTime && currentTime < maghribTime) {
            body.classList.add('asr');
        } else if (currentTime >= maghribTime && currentTime < ishaTime) {
            body.classList.add('maghrib');
        } else  {
            body.classList.add('isha');
        }


    /*
    else if (currentTime >= ishaTime) {
        main.classList.add('isha');
    } */
}
const cityId = localStorage.getItem("cityId") || 58
salahTimming(cityId)
document.querySelector('#cities').addEventListener("change", function() {
    const cityId = this.value;
    localStorage.setItem("cityId", cityId)
    salahTimming(cityId);
});
//QURAN API
//https://mp3quran.net/api/v3/reciters
function getReciters() {
    axios.get(`https://mp3quran.net/api/v3/reciters`)
    .then(function (response) {
        const reciters = response.data.reciters
        const chooseReciters = document.querySelector('#reciters')
        reciters.forEach(reciter => {
            chooseReciters.innerHTML +=`
            <option value="${reciter.id}">${reciter.name}</option>
            `
        })
        chooseReciters.addEventListener('change', function(e){
            getMoshaf(e.target.value)
        })
    });
}
getReciters()
function getMoshaf(reciter){
    axios.get(`https://www.mp3quran.net/api/v3/reciters?language=ar&reciter=${reciter}`)
    .then(function (response) {
        const moshafs = response.data.reciters[0].moshaf
        const chooseMoshaf = document.querySelector('#moshaf')
        chooseMoshaf.innerHTML= ' <option value="">اختر رواية</option>'
        moshafs.forEach(moshaf =>{
          //  console.log(moshaf)
            chooseMoshaf.innerHTML += `
            <option value="${moshaf.id}" data-server="${moshaf.server}" data-surahlist="${moshaf.surah_list}">${moshaf.name}</option>
            ` 
        })
        chooseMoshaf.addEventListener('change', function(e){
            const selectedMoshaf = chooseMoshaf.options[chooseMoshaf.selectedIndex]
            const surahServer = selectedMoshaf.dataset.server
            const surahList = selectedMoshaf.dataset.surahlist
            getSurah(surahServer, surahList)
        })


    });
}
function getSurah(surahServer, surahList){
    axios.get(`https://mp3quran.net/api/v3/suwar`)
    .then(function (response) {
        surahList = surahList.split(',')
        const surahNames = response.data.suwar
        const chooseSurah = document.querySelector('#surah')
        chooseSurah.innerHTML ='<option value="">اختر سورة</option>'
        surahList.forEach(surah=>{
            const padSurah = surah.padStart(3, '0')
            surahNames.forEach(surahName =>{
                if(surahName.id == surah){
                    chooseSurah.innerHTML +=`
                                <option value="${surahServer}${padSurah}.mp3">${surahName.name}</option>
                    `
                }
            })
        })
        chooseSurah.addEventListener('change', function(e){
            const selectedSurah = chooseSurah.options[chooseSurah.selectedIndex]
            audioPlayer(selectedSurah.value, "#audio-player")
        })
    })

}
function audioPlayer(link, id){
    const audioPlayer = document.querySelector(`${id}`)
    audioPlayer.src = link
    audioPlayer.play()
}
//TAFSSIR TABARY
function getSurahTafssir(){
    axios.get(`https://mp3quran.net/api/v3/suwar`)
    .then(function (response) {
        const suwar = response.data.suwar
        const surahSelect = document.querySelector('#surah-name')
        surahSelect.innerHTML = '<option value="">اختر سورة</option> '
        suwar.forEach(surah =>{
            surahSelect.innerHTML += `
            <option value="${surah.id}">${surah.name}</option>
            `
        })
        surahSelect.addEventListener('change', function(e){
            getPartTafssir(e.target.value)
        })
    })

}
getSurahTafssir()

function getPartTafssir(surahId){
    axios.get(`https://www.mp3quran.net/api/v3/tafsir?sura=${surahId}`)
    .then(function (response) {
       const parts = response.data.tafasir.soar[surahId]
       const tafssirSelect = document.querySelector('#tafssir')
       tafssirSelect.innerHTML= '<option value="">اختر جزء</option>'
       parts.forEach(part =>{
        tafssirSelect.innerHTML +=`
            <option value="${part.url}">${part.name}</option>
        `
       })
       tafssirSelect.addEventListener('change', function(e){
        audioPlayer(e.target.value, "#audio-player-tafssir")
    })
    })
}

/* function tafssirPlay(url){
    const audioPlayer = document.querySelector('#audio-player-tafssir')
    audioPlayer.src = url
    audioPlayer.play()
}
getRadio()
function playRadio(url){
    const radioPlay = document.querySelector('#audio-player-radio')
    radioPlay.src = url
    radioPlay.play()
} */
//RADIO 
function getRadio(){
    axios.get(`https://mp3quran.net/api/v3/radios`)
    .then(function (response) {
        const radios = response.data.radios
        const radioSelect = document.querySelector('#radio')
        radios.forEach(radio =>{
            radioSelect.innerHTML += `
            <option value="${radio.url}">${radio.name}</option>
            `
        })
      radioSelect.addEventListener('change', function(e){
            audioPlayer(e.target.value, "#audio-player-radio")
        })  
    })

}
getRadio()
//Tadabor
function getTadabor(){
    const randomId =  Math.floor(Math.random() * 92);
    axios.get(`https://mp3quran.net/api/v3/tadabor?sura=${randomId}&language=ar`)
    .then(function (response) {
        console.log(response.data.tadabor)
        console.log('done')
       })

    }
    getTadabor()


    const tabs = document.querySelectorAll('.icon-btn')
    const all_content = document.querySelectorAll('.content')
    
    tabs.forEach((tab, index)=>{
        tab.addEventListener('click', (e)=>{
            const salam =  document.querySelector('.salam')
            salam.classList.add('none') 
            tabs.forEach(tab => {
                tab.classList.remove('shadow')
            })
            tab.classList.add('shadow')

            all_content.forEach(content => {
                content.classList.remove('active')
            })
            all_content[index].classList.add('active')
        })
    
    })