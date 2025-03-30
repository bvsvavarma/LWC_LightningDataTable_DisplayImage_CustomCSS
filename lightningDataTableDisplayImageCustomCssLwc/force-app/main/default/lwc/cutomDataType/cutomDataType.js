import LightningDataTable from 'lightning/datatable';
import customNameTemplate from './customName.html';
import customRankTemplate from './customRank.html';
import customImageTemplate from './customImage.html';

export default class CutomDataType extends LightningDataTable {
    static customTypes = {
        customNameType: {
            template: customNameTemplate,
            standardCellLayout: true,
            typeAttributes: ["contactName"]
        },
        customRank: {
            template: customRankTemplate,
            standardCellLayout: false,
            typeAttributes: ["rankIcon"],
        },
        customPicture: {
            template: customImageTemplate,
            standardCellLayout: true,
            typeAttributes: ["pictureUrl"],
        }
    };
}