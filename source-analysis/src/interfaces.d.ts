/**
 * Created by Roman on 23.09.2016.
 */
interface Rule {
    from: RegExp;
    to: string;
    off?: boolean;
}

interface AnalyseJSON {
    target: string;
    signatures: Array<string>;
    ucg_options?: Array<string>;
}

interface PromiseResolveAnalyseData {
    data: string;
    signature: string
}