exports.predictNeedWatering = (soil, temp, humidity) => {
    return soil < 50 || humidity < 60;
};