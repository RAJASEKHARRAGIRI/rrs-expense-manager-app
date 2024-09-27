import Moment from 'moment';

export const GetCurrentDateTime = () => {
    const date = new Date();
    Moment.locale('en');
    return Moment(date).format('MM/DD/YYYY hh:mm:ss');
}