/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
// tslint:disable-next-line: no-imports-from-dist
import * as tfOps from '@tensorflow/tfjs-core/dist/ops/ops_for_converter';
import { getParamValue } from './utils';
export const executeOp = (node, tensorMap, context) => {
    switch (node.op) {
        case 'Max': {
            const axis = getParamValue('axis', node, tensorMap, context);
            const keepDims = getParamValue('keepDims', node, tensorMap, context);
            return [tfOps.max(getParamValue('x', node, tensorMap, context), axis, keepDims)];
        }
        case 'Mean': {
            const axis = getParamValue('axis', node, tensorMap, context);
            const keepDims = getParamValue('keepDims', node, tensorMap, context);
            return [tfOps.mean(getParamValue('x', node, tensorMap, context), axis, keepDims)];
        }
        case 'Min': {
            const axis = getParamValue('axis', node, tensorMap, context);
            const keepDims = getParamValue('keepDims', node, tensorMap, context);
            return [tfOps.min(getParamValue('x', node, tensorMap, context), axis, keepDims)];
        }
        case 'Sum': {
            const axis = getParamValue('axis', node, tensorMap, context);
            const keepDims = getParamValue('keepDims', node, tensorMap, context);
            return [tfOps.sum(getParamValue('x', node, tensorMap, context), axis, keepDims)];
        }
        case 'All': {
            const axis = getParamValue('axis', node, tensorMap, context);
            const keepDims = getParamValue('keepDims', node, tensorMap, context);
            return [tfOps.all(getParamValue('x', node, tensorMap, context), axis, keepDims)];
        }
        case 'Any': {
            const axis = getParamValue('axis', node, tensorMap, context);
            const keepDims = getParamValue('keepDims', node, tensorMap, context);
            return [tfOps.any(getParamValue('x', node, tensorMap, context), axis, keepDims)];
        }
        case 'ArgMax': {
            const axis = getParamValue('axis', node, tensorMap, context);
            return [tfOps.argMax(getParamValue('x', node, tensorMap, context), axis)];
        }
        case 'ArgMin': {
            const axis = getParamValue('axis', node, tensorMap, context);
            return [tfOps.argMin(getParamValue('x', node, tensorMap, context), axis)];
        }
        case 'Prod': {
            const axis = getParamValue('axis', node, tensorMap, context);
            const keepDims = getParamValue('keepDims', node, tensorMap, context);
            return [tfOps.prod(getParamValue('x', node, tensorMap, context), axis, keepDims)];
        }
        case 'Cumsum': {
            const axis = getParamValue('axis', node, tensorMap, context);
            const exclusive = getParamValue('exclusive', node, tensorMap, context);
            const reverse = getParamValue('reverse', node, tensorMap, context);
            return [tfOps.cumsum(getParamValue('x', node, tensorMap, context), axis, exclusive, reverse)];
        }
        case 'Bincount':
            const x = getParamValue('x', node, tensorMap, context);
            const weights = getParamValue('weights', node, tensorMap, context);
            const size = getParamValue('size', node, tensorMap, context);
            return [tfOps.bincount(x, weights, size)];
        case 'DenseBincount': {
            const x = getParamValue('x', node, tensorMap, context);
            const weights = getParamValue('weights', node, tensorMap, context);
            const size = getParamValue('size', node, tensorMap, context);
            const binaryOutput = getParamValue('binaryOutput', node, tensorMap, context);
            return [tfOps.denseBincount(x, weights, size, binaryOutput)];
        }
        default:
            throw TypeError(`Node type ${node.op} is not implemented`);
    }
};
export const CATEGORY = 'reduction';
//# sourceMappingURL=reduction_executor.js.map