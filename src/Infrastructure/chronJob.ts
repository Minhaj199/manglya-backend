import { CronJob} from 'cron'
import { CroneService } from '../application/services/croneService.js' 
import { UserRepsitories } from './repositories/userRepository.js'  

const croneService=new CroneService(new UserRepsitories)
export const job=new CronJob('0 0 0/24 * * *',()=>{
    
    try {
        croneService.checkExperation()
    } catch (error) {
        console.log(error)
    }
}
)



