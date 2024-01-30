const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const audio= $('#audio')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb= $('.cd-thumb')
const playBtn= $('.btn-toggle-play')
const nextBtn= $('.btn-next')
const prevBtn= $('.btn-prev')
const randomBtn= $('.btn-random')
const repeatBtn= $('.btn-repeat')
const player = $('.player')
const progress= $('#progress')
const playlist= $('.playlist')
const timeAudioRight= $('.time-audio-right')
const timeAudioLeft= $('.time-audio-left')


const app={
  currentIndex:0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  songs:[
    {name: 'Nàng Thơ',
    singer: 'Hoang Dung',
    path: 'assets/music/nangtho.mp3',
    image: './assets/img/anh1.png'},
    {name: 'Lắng nghe nước mắt',
    singer: 'Mr.Siro',
    path: 'assets/music/LangNgheNuocMat.mp3',
    image: 'assets/img/anh2.png'},
    {name: 'Nang Tho',
    singer: 'Hoang Dung',
    path: 'assets/music/nangtho.mp3',
    image: 'assets/img/anh1.png'},
    {name: 'Lang Nghe Nuoc Mat',
    singer: 'Mr.Siro',
    path: 'assets/music/LangNgheNuocMat.mp3',
    image: 'assets/img/anh2.png'}
  ],

  render: function(){
    const htmls= this.songs.map((song,index) =>{
      return `
      <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
            <div class="thumb" style="background-image: url('${song.image}')">       
        </div>
        <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
        </div>
        <div class="option">
          <i class="fas fa-ellipsis-h"></i>
        </div>
      </div>  
      `
    })
    $('.playlist').innerHTML=htmls.join('')
  },
  defineProperties: function(){
    Object.defineProperty(this,'currentSong',{
      get: function(){
        return this.songs[this.currentIndex]
      }
    })
  },

  toFixedDevChromeAudioPlay: function(){
    const playAudioPromise = audio.play()
    if(playAudioPromise !== undefined){
      playAudioPromise.then(function(){
        audio.play()
      })
      .catch(function(err){

      })
    }
    
  },

  handleEvents: function(){

    const _this = this
    const cdWidth = cd.offsetWidth
    const cdThumb= $('.cd-thumb')
    const cdThumbAnimate= cdThumb.animate([
      {transform: 'rotate(360deg)'}
    ],{
      duration: 5000,
      iterations: Infinity
    })
    cdThumbAnimate.pause() //phai pause thi khi moi load web no khong chay tu dong

    document.onscroll = function(){
      const scrollTop= document.documentElement.scrollTop || window.scrollY
      const newCdWidth = cdWidth - scrollTop
      
      cd.style.width =newCdWidth > 0 ? newCdWidth+ 'px' : 0
      cd.style.opacity = newCdWidth / cdWidth
    }

    playBtn.onclick= function (){
      if(_this.isPlaying){
        audio.pause()
      }else{
        audio.play()
      }
    }

    randomBtn.onclick = function(){
      _this.isRandom =!_this.isRandom
      randomBtn.classList.toggle('active',_this.isRandom)
    }

    repeatBtn.onclick = function(){
      _this.isRepeat =!_this.isRepeat
      repeatBtn.classList.toggle('active',_this.isRepeat)
    }

    audio.onended = function(){
      if(_this.isRepeat){
        audio.play()
      } else {
        nextBtn.click()  //khong can chon onclick
      }
    }

    nextBtn.onclick= function(){
      if(_this.isRandom){
        _this.playRandomSong()
      }
      else{_this.nextSong()}

      audio.play()
      // var songActive = $('.active')
      // songActive.classList.remove('active')
      _this.render()
      _this.scrollToActiveSong()
      
    }
    prevBtn.onclick = function(){
      if(_this.isRandom){
        _this.playRandomSong()
      }
      else {
        _this.prevSong()
      }
      audio.play()
      _this.render()
      _this.scrollToActiveSong()
    }

    audio.onplay= function(){
      _this.isPlaying= true
      player.classList.add('playing')
      cdThumbAnimate.play()
    }
    audio.onpause= function(){
      _this.isPlaying= false //de con co the nhan di nhan lai duoc
      player.classList.remove('playing')
      cdThumbAnimate.pause()
    }

    audio.ontimeupdate= function(){
      if (audio.duration){
        const progressPercent= Math.floor (audio.currentTime/audio.duration*100)
        progress.value = progressPercent
        const currentTimedisplay= Number(Math.floor(audio.currentTime))

        timeAudioLeft.textContent = _this.setTimeChangeAudio(currentTimedisplay)
        console.log(Math.floor(audio.currentTime))
        //console.log(progress.value) //the progress la input co type= range nen gia tri chinh la percent, precent thay doi thi vi tri se thay doi
      }
    }

    progress.oninput= function(e){
      const seekTime= audio.duration * e.target.value /100
      audio.currentTime= seekTime
      console.log('555')
    }

    audio.onloadedmetadata= function(){
      const floorDura = Math.floor(audio.duration)
      const second = floorDura %60
      const minute =(floorDura - second)/60
      const timeAudio = minute +':'+ second

      if(minute <10){
        timeAudioRight.textContent = '0' + timeAudio
      }
    }


    
    playlist.onclick= function(e){
      if(e.target.closest('.song:not(.active)') || !e.target.closest('.option')){
        if(e.target.closest('.song:not(.active)')){
          _this.currentIndex = Number(e.target.closest('.song').dataset.index)
          _this.loadCurrentSong()
          _this.render()
          audio.play()
        }
        if(e.target.closest('.option')){
          alert("We have not completed this function")
          console.log("hihi")
        }
      }
      if (e.target.closest('.option')){
        alert("We have not completed this function")
      }
    }

  },


  loadCurrentSong: function(){
    heading.textContent = this.currentSong.name
    cdThumb.style.backgroundImage=`url('${this.currentSong.image}')`
    audio.src=this.currentSong.path
    
    //console.log(audio.src)
  },

  nextSong: function(){
    this.currentIndex++
    if(this.currentIndex >= this.songs.length){
      this.currentIndex = 0}
    this.loadCurrentSong()
  },

  prevSong: function(){
    this.currentIndex--
    if(this.currentIndex<0){
      this.currentIndex = this.songs.length -1 
    }
    this.loadCurrentSong()
  },

  playRandomSong: function(){
    let newIndex
    do{
      newIndex= Math.floor(Math.random()* this.songs.length)
    } while (newIndex=== this.currentIndex)

    this.currentIndex= newIndex
    this.loadCurrentSong()
  },

  scrollToActiveSong: function(){
    setTimeout(()=>{
      $('.song.active').scrollIntoView({
        behavior:'smooth',
        block: 'end'
      })
    },300)
  },


  setTimeChangeAudio: function(val){
  
    if(val >60){
      const second = val % 60
      const minute = (val - second)/60
      if (minute <10) {
        if(second <10){
        return '0'+ minute + ':' + '0' + second}
        else 
        {return '0'+ minute + ':' + second}
      }
      if (minute >10){
        if(second <10){
          return minute + ':' + '0' + second}
          else 
          {return minute + ':' + second}

      }
    }
    else{
      if (val <10){
      return '00:0' + val
    } 
    else {
      return '00:' + val
    }}
  },


  






  start: function(){
    this.defineProperties()
    this.handleEvents()
    this.loadCurrentSong()
    this.render()
    
  }
}




app.start()

       