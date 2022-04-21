import wrong_rep from '../Assets/Sound/high_knees/HIGH KNEES_correction.mp3'
import HKMG from '../Assets/Sound/high_knees/HIGH KNEES_motivation_great.mp3'
import HKMR from '../Assets/Sound/high_knees/HIGH KNEES_motivation_reps.mp3'

const correction = 10

// const wrong_audio = new Audio(wrong_rep)
// const great_audio = new Audio(HKMG)
// const last_few_audio = new Audio(HKMR)

export class HighKnees {
    constructor() {
        this.is_high_right = false
        this.is_high_left = false
        this.prev = true
        this.turn = 0
        this.array = []
        this.count = 0
        this.p1 = 0
        this.p2 = 0
    }
    isValid(RLD, RK, LK, RH, LH, RA, LA) {
        if (RLD <= 50) {
            if (!this.prev) {
                // console.log(this.array)
                if (this.turn === 1) {
                    if (this.is_high_right) {
                        // console.log('=======right knee======')
                        this.array.push('fr')
                    }
                    else {
                        // console.log('low right  knee')
                        this.array.push('hr')
                    }
                }
                else {
                    if (this.is_high_left) {
                        // console.log('=======left knee======')
                        this.array.push('fl')
                    }
                    else {
                        // console.log('low left knee')
                        this.array.push('hl')
                    }
                }
                if (this.array.length > 1) {
                    if (this.array.includes('fr') && this.array.includes('fl')) {
                        // console.count('########high knee###########')
                        this.count += 1
                    }
                    else {
                        // console.count('*****wrong knee*******')
                        wrong_audio.play()
                    }
                    this.array = []
                }
                this.is_high_right = false
                this.is_high_left = false
            }
            this.prev = true

        }
        else {
            if (LA > RA) {
                //right knee up
                this.turn = 1
                if (RK <= RH + correction || RA <= LK + correction) {
                    this.is_high_right = true
                }
            }
            else {
                //left knee up
                this.turn = 2
                if (LK <= LH + correction || LA <= RK + correction) {
                    this.is_high_left = true
                }
            }
            this.prev = false
        }
        if ((this.count === 5 || this.count === 15) && this.p1 !== this.count) {
            great_audio.play()
            this.p1 = this.count
        }
        if (this.count === 10 && this.p2 !== this.count) {
            last_few_audio.play()
            this.p2 = this.count
        }
        return this.count
    }
}
