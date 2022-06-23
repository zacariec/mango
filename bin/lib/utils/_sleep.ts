const sleep = async (ms: number): Promise<Promise<void>> => new Promise(resolve => setTimeout(resolve, ms));

export default sleep;

