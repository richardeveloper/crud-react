export const masksHelper = () => {

    const maskMoney = (money) => {
        money = parseFloat(money).toFixed(2);
        money = money.replace('.', ',');
    
        return `R$ ${money}`;
    }

    const maskPhone = (phone) => {
        const ddd = phone.substring(0, 2);
        const first = phone.substring(2, 7);
        const second = phone.substring(7, phone.length);
    
        return `(${ddd}) ${first}-${second}`;
    }

    return {
        maskMoney,
        maskPhone
    };

}