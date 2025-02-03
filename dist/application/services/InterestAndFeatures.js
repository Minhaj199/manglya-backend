var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class FixedDataService {
    constructor(interestRepo, featureRepo) {
        this.interestRepo = interestRepo;
        this.featureRepo = featureRepo;
    }
    creatInterest() {
        return __awaiter(this, void 0, void 0, function* () {
            const interestData = {
                sports: ['Football', 'Cricket', 'Hockey'],
                music: ['Hollywood', 'Bollywood', 'Molywood'],
                food: ['Biryani', 'Sadya']
            };
            try {
                const isExist = yield this.interestRepo.isExist();
                if (!isExist) {
                    yield this.interestRepo.create(interestData);
                }
            }
            catch (error) {
            }
        });
    }
    createFeatures() {
        return __awaiter(this, void 0, void 0, function* () {
            const features = ['Unlimited message', 'Suggestion', 'Priority'];
            try {
                const isExist = yield this.featureRepo.isExits();
                if (!isExist) {
                    yield this.featureRepo.create({ features });
                    console.log('features added');
                }
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    fetchFeature() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.featureRepo.fetchFeature();
                return result;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    fetchInterestAsCategory() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.interestRepo.getInterestAsCategory();
                if (data) {
                    return data;
                }
                else {
                    throw new Error('interest not found');
                }
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
}
