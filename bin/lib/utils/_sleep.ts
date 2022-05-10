const sleep = async (ms): Promise<Promise<void>> => new Promise(resolve => setTimeout(resolve, ms));

export default sleep;

