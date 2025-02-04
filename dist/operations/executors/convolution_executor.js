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
import { getPadding, getParamValue } from './utils';
function fusedConvAndDepthWiseParams(node, tensorMap, context) {
    const [extraOp, activationFunc] = getParamValue('fusedOps', node, tensorMap, context);
    const isBiasAdd = extraOp === 'biasadd';
    const isPrelu = activationFunc === 'prelu';
    const isBatchNorm = extraOp === 'fusedbatchnorm';
    const numArgs = getParamValue('numArgs', node, tensorMap, context);
    if (isBiasAdd) {
        if (isPrelu && numArgs !== 2) {
            throw new Error('FusedConv2d and DepthwiseConv2d with BiasAdd and Prelu ' +
                'must have two extra arguments: bias and alpha.');
        }
        if (!isPrelu && numArgs !== 1) {
            throw new Error('FusedConv2d and DepthwiseConv2d with BiasAdd must have ' +
                'one extra argument: bias.');
        }
    }
    if (isBatchNorm) {
        throw new Error('FusedConv2d and DepthwiseConv2d with FusedBatchNorm is not supported');
    }
    const stride = getParamValue('strides', node, tensorMap, context);
    const pad = getPadding(node, tensorMap, context);
    const dataFormat = getParamValue('dataFormat', node, tensorMap, context)
        .toUpperCase();
    const dilations = getParamValue('dilations', node, tensorMap, context);
    const [biasArg, preluArg] = getParamValue('args', node, tensorMap, context);
    const leakyreluAlpha = getParamValue('leakyreluAlpha', node, tensorMap, context);
    return {
        stride,
        pad,
        dataFormat,
        dilations,
        biasArg,
        preluArg,
        activationFunc,
        leakyreluAlpha
    };
}
export const executeOp = (node, tensorMap, context) => {
    switch (node.op) {
        case 'Conv1D': {
            const stride = getParamValue('stride', node, tensorMap, context);
            const pad = getParamValue('pad', node, tensorMap, context);
            const dataFormat = getParamValue('dataFormat', node, tensorMap, context)
                .toUpperCase();
            const dilation = getParamValue('dilation', node, tensorMap, context);
            return [tfOps.conv1d(getParamValue('x', node, tensorMap, context), getParamValue('filter', node, tensorMap, context), stride, pad, dataFormat, dilation)];
        }
        case 'Conv2D': {
            const stride = getParamValue('strides', node, tensorMap, context);
            const pad = getPadding(node, tensorMap, context);
            const dataFormat = getParamValue('dataFormat', node, tensorMap, context)
                .toUpperCase();
            const dilations = getParamValue('dilations', node, tensorMap, context);
            return [tfOps.conv2d(getParamValue('x', node, tensorMap, context), getParamValue('filter', node, tensorMap, context), [stride[1], stride[2]], pad, dataFormat, [dilations[1], dilations[2]])];
        }
        case '_FusedConv2D': {
            const { stride, pad, dataFormat, dilations, biasArg, preluArg, activationFunc, leakyreluAlpha } = fusedConvAndDepthWiseParams(node, tensorMap, context);
            return [tfOps.fused.conv2d({
                    x: getParamValue('x', node, tensorMap, context),
                    filter: getParamValue('filter', node, tensorMap, context),
                    strides: [stride[1], stride[2]],
                    pad: pad,
                    dataFormat: dataFormat,
                    dilations: [dilations[1], dilations[2]],
                    bias: biasArg,
                    activation: activationFunc,
                    preluActivationWeights: preluArg,
                    leakyreluAlpha
                })];
        }
        case 'FusedDepthwiseConv2dNative': {
            const { stride, pad, dataFormat, dilations, biasArg, preluArg, activationFunc, leakyreluAlpha, } = fusedConvAndDepthWiseParams(node, tensorMap, context);
            return [tfOps.fused.depthwiseConv2d({
                    x: getParamValue('x', node, tensorMap, context),
                    filter: getParamValue('filter', node, tensorMap, context),
                    strides: [stride[1], stride[2]],
                    pad: pad,
                    dataFormat: dataFormat,
                    dilations: [dilations[1], dilations[2]],
                    bias: biasArg,
                    activation: activationFunc,
                    preluActivationWeights: preluArg,
                    leakyreluAlpha
                })];
        }
        case 'Conv2DBackpropInput':
        case 'Conv2dTranspose': {
            const shape = getParamValue('outputShape', node, tensorMap, context);
            const stride = getParamValue('strides', node, tensorMap, context);
            const pad = getPadding(node, tensorMap, context);
            return [tfOps.conv2dTranspose(getParamValue('x', node, tensorMap, context), getParamValue('filter', node, tensorMap, context), shape, [stride[1], stride[2]], pad)];
        }
        case 'DepthwiseConv2dNative':
        case 'DepthwiseConv2d': {
            const stride = getParamValue('strides', node, tensorMap, context);
            const pad = getPadding(node, tensorMap, context);
            const dilations = getParamValue('dilations', node, tensorMap, context);
            const dataFormat = getParamValue('dataFormat', node, tensorMap, context)
                .toUpperCase();
            return [tfOps.depthwiseConv2d(getParamValue('input', node, tensorMap, context), getParamValue('filter', node, tensorMap, context), [stride[1], stride[2]], pad, dataFormat, [dilations[1], dilations[2]])];
        }
        case 'Conv3D': {
            const stride = getParamValue('strides', node, tensorMap, context);
            const pad = getParamValue('pad', node, tensorMap, context);
            const dataFormat = getParamValue('dataFormat', node, tensorMap, context)
                .toUpperCase();
            const dilations = getParamValue('dilations', node, tensorMap, context);
            return [tfOps.conv3d(getParamValue('x', node, tensorMap, context), getParamValue('filter', node, tensorMap, context), [stride[1], stride[2], stride[3]], pad, dataFormat, [dilations[1], dilations[2], dilations[3]])];
        }
        case 'AvgPool': {
            const stride = getParamValue('strides', node, tensorMap, context);
            const pad = getParamValue('pad', node, tensorMap, context);
            const kernelSize = getParamValue('kernelSize', node, tensorMap, context);
            return [tfOps.avgPool(getParamValue('x', node, tensorMap, context), [kernelSize[1], kernelSize[2]], [stride[1], stride[2]], pad)];
        }
        case 'MaxPool': {
            const stride = getParamValue('strides', node, tensorMap, context);
            const pad = getParamValue('pad', node, tensorMap, context);
            const kernelSize = getParamValue('kernelSize', node, tensorMap, context);
            return [tfOps.maxPool(getParamValue('x', node, tensorMap, context), [kernelSize[1], kernelSize[2]], [stride[1], stride[2]], pad)];
        }
        case 'MaxPoolWithArgmax': {
            const stride = getParamValue('strides', node, tensorMap, context);
            const pad = getParamValue('pad', node, tensorMap, context);
            const kernelSize = getParamValue('kernelSize', node, tensorMap, context);
            const includeBatchInIndex = getParamValue('includeBatchInIndex', node, tensorMap, context);
            const { result, indexes } = tfOps.maxPoolWithArgmax(getParamValue('x', node, tensorMap, context), [kernelSize[1], kernelSize[2]], [stride[1], stride[2]], pad, includeBatchInIndex);
            return [result, indexes];
        }
        case 'AvgPool3D': {
            const stride = getParamValue('strides', node, tensorMap, context);
            const pad = getParamValue('pad', node, tensorMap, context);
            const kernelSize = getParamValue('kernelSize', node, tensorMap, context);
            return [tfOps.avgPool3d(getParamValue('x', node, tensorMap, context), [kernelSize[1], kernelSize[2], kernelSize[3]], [stride[1], stride[2], stride[3]], pad)];
        }
        case 'MaxPool3D': {
            const stride = getParamValue('strides', node, tensorMap, context);
            const pad = getParamValue('pad', node, tensorMap, context);
            const kernelSize = getParamValue('kernelSize', node, tensorMap, context);
            return [tfOps.maxPool3d(getParamValue('x', node, tensorMap, context), [kernelSize[1], kernelSize[2], kernelSize[3]], [stride[1], stride[2], stride[3]], pad)];
        }
        case 'Dilation2D': {
            const strides = getParamValue('strides', node, tensorMap, context);
            const pad = getParamValue('pad', node, tensorMap, context);
            const dilations = getParamValue('dilations', node, tensorMap, context);
            // strides: [1, stride_height, stride_width, 1].
            const strideHeight = strides[1];
            const strideWidth = strides[2];
            // dilations: [1, dilation_height, dilation_width, 1].
            const dilationHeight = dilations[1];
            const dilationWidth = dilations[2];
            return [tfOps.dilation2d(getParamValue('x', node, tensorMap, context), getParamValue('filter', node, tensorMap, context), [strideHeight, strideWidth], pad, [dilationHeight, dilationWidth], 'NHWC' /* dataFormat */)];
        }
        default:
            throw TypeError(`Node type ${node.op} is not implemented`);
    }
};
export const CATEGORY = 'convolution';
//# sourceMappingURL=convolution_executor.js.map