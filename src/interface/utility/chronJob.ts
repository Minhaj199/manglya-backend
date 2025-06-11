import { CronJob} from 'cron'
import { CroneService } from '../../application/services/croneService.ts' 
import { UserRepsitories } from '../../infrastructure/repositories/userRepository.ts'  

const croneService=new CroneService(new UserRepsitories)
export const job=new CronJob('0 0 0/24 * * *',()=>{
    
    try {
        croneService.checkExperation()
    } catch (error) {
        console.log(error)
    }
}
)



