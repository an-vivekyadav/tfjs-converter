/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
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
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@tensorflow/tfjs-core'), require('@tensorflow/tfjs-core/dist/ops/ops_for_converter')) :
  typeof define === 'function' && define.amd ? define(['exports', '@tensorflow/tfjs-core', '@tensorflow/tfjs-core/dist/ops/ops_for_converter'], factory) :
  (global = global || self, factory(global.tf = global.tf || {}, global.tf, global.tf));
}(this, (function (exports, tfc, tfOps) { 'use strict';

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
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
   *
   * =============================================================================
   */
  /** DataType enum. */
  var DataType;
  (function (DataType) {
      DataType[DataType["DT_INVALID"] = 0] = "DT_INVALID";
      DataType[DataType["DT_FLOAT"] = 1] = "DT_FLOAT";
      DataType[DataType["DT_DOUBLE"] = 2] = "DT_DOUBLE";
      DataType[DataType["DT_INT32"] = 3] = "DT_INT32";
      DataType[DataType["DT_UINT8"] = 4] = "DT_UINT8";
      DataType[DataType["DT_INT16"] = 5] = "DT_INT16";
      DataType[DataType["DT_INT8"] = 6] = "DT_INT8";
      DataType[DataType["DT_STRING"] = 7] = "DT_STRING";
      DataType[DataType["DT_COMPLEX64"] = 8] = "DT_COMPLEX64";
      DataType[DataType["DT_INT64"] = 9] = "DT_INT64";
      DataType[DataType["DT_BOOL"] = 10] = "DT_BOOL";
      DataType[DataType["DT_QINT8"] = 11] = "DT_QINT8";
      DataType[DataType["DT_QUINT8"] = 12] = "DT_QUINT8";
      DataType[DataType["DT_QINT32"] = 13] = "DT_QINT32";
      DataType[DataType["DT_BFLOAT16"] = 14] = "DT_BFLOAT16";
      DataType[DataType["DT_FLOAT_REF"] = 101] = "DT_FLOAT_REF";
      DataType[DataType["DT_DOUBLE_REF"] = 102] = "DT_DOUBLE_REF";
      DataType[DataType["DT_INT32_REF"] = 103] = "DT_INT32_REF";
      DataType[DataType["DT_UINT8_REF"] = 104] = "DT_UINT8_REF";
      DataType[DataType["DT_INT16_REF"] = 105] = "DT_INT16_REF";
      DataType[DataType["DT_INT8_REF"] = 106] = "DT_INT8_REF";
      DataType[DataType["DT_STRING_REF"] = 107] = "DT_STRING_REF";
      DataType[DataType["DT_COMPLEX64_REF"] = 108] = "DT_COMPLEX64_REF";
      DataType[DataType["DT_INT64_REF"] = 109] = "DT_INT64_REF";
      DataType[DataType["DT_BOOL_REF"] = 110] = "DT_BOOL_REF";
      DataType[DataType["DT_QINT8_REF"] = 111] = "DT_QINT8_REF";
      DataType[DataType["DT_QUINT8_REF"] = 112] = "DT_QUINT8_REF";
      DataType[DataType["DT_QINT32_REF"] = 113] = "DT_QINT32_REF";
      DataType[DataType["DT_BFLOAT16_REF"] = 114] = "DT_BFLOAT16_REF";
  })(DataType || (DataType = {}));
  var SaverDef;
  (function (SaverDef) {
      /** CheckpointFormatVersion enum. */
      let CheckpointFormatVersion;
      (function (CheckpointFormatVersion) {
          CheckpointFormatVersion[CheckpointFormatVersion["LEGACY"] = 0] = "LEGACY";
          CheckpointFormatVersion[CheckpointFormatVersion["V1"] = 1] = "V1";
          CheckpointFormatVersion[CheckpointFormatVersion["V2"] = 2] = "V2";
      })(CheckpointFormatVersion = SaverDef.CheckpointFormatVersion || (SaverDef.CheckpointFormatVersion = {}));
  })(SaverDef || (SaverDef = {}));

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
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
  const CUSTOM_OPS = {};
  /**
   * Register an Op for graph model executor. This allow you to register
   * TensorFlow custom op or override existing op.
   *
   * Here is an example of registering a new MatMul Op.
   * ```js
   * const customMatmul = (node) =>
   *    tf.matMul(
   *        node.inputs[0], node.inputs[1],
   *        node.attrs['transpose_a'], node.attrs['transpose_b']);
   *
   * tf.registerOp('MatMul', customMatmul);
   * ```
   * The inputs and attrs of the node object is based on the TensorFlow op
   * registry.
   *
   * @param name The Tensorflow Op name.
   * @param opFunc An op function which is called with the current graph node
   * during execution and needs to return a tensor or a list of tensors. The node
   * has the following attributes:
   *    - attr: A map from attribute name to its value
   *    - inputs: A list of input tensors
   *
   * @doc {heading: 'Models', subheading: 'Op Registry'}
   */
  function registerOp(name, opFunc) {
      const opMapper = {
          tfOpName: name,
          category: 'custom',
          inputs: [],
          attrs: [],
          customExecutor: opFunc
      };
      CUSTOM_OPS[name] = opMapper;
  }
  /**
   * Retrieve the OpMapper object for the registered op.
   *
   * @param name The Tensorflow Op name.
   *
   * @doc {heading: 'Models', subheading: 'Op Registry'}
   */
  function getRegisteredOp(name) {
      return CUSTOM_OPS[name];
  }
  /**
   * Deregister the Op for graph model executor.
   *
   * @param name The Tensorflow Op name.
   *
   * @doc {heading: 'Models', subheading: 'Op Registry'}
   */
  function deregisterOp(name) {
      delete CUSTOM_OPS[name];
  }

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
  function getParamValue(paramName, node, tensorMap, context, resourceManager) {
      const inputParam = node.inputParams[paramName];
      if (inputParam && inputParam.inputIndexStart !== undefined) {
          const start = inputParam.inputIndexStart;
          const end = inputParam.inputIndexEnd === 0 ?
              undefined :
              (inputParam.inputIndexEnd === undefined ? start + 1 :
                  inputParam.inputIndexEnd);
          if (inputParam.type === 'tensor') {
              return getTensor(node.inputNames[inputParam.inputIndexStart], tensorMap, context, resourceManager);
          }
          if (inputParam.type === 'tensors') {
              const inputs = node.inputNames.slice(start, end);
              return inputs.map(name => getTensor(name, tensorMap, context, resourceManager));
          }
          const tensor = getTensor(node.inputNames.slice(start)[0], tensorMap, context, resourceManager);
          const data = tensor.dataSync();
          return inputParam.type === 'number' ?
              data[0] :
              tfc.util.toNestedArray(tensor.shape, data);
      }
      const attrParam = node.attrParams[paramName];
      return attrParam && attrParam.value;
  }
  /**
   * Retrieve the tensor from tensorsMap based on input name.
   * @param name Node input name
   * @param tensorsMap Tensors map keyed by the node
   * @param context contains tensors and information for running the current node.
   * @param resourceManager Optional. Contains global resources of the model.
   */
  function getTensor(name, tensorsMap, context, resourceManager) {
      const [nodeName, index] = parseNodeName(name);
      if (resourceManager != null) {
          const tensor = resourceManager.getHashTableHandleByName(nodeName);
          if (tensor != null) {
              return tensor;
          }
      }
      const contextId = context.currentContextIds.find(contextId => {
          return !!tensorsMap[getNodeNameWithContextId(nodeName, contextId)];
      });
      return contextId !== undefined ?
          tensorsMap[getNodeNameWithContextId(nodeName, contextId)][index] :
          undefined;
  }
  /**
   * Retrieve the tensors based on input name for current context.
   * @param name Node input name
   * @param tensorsMap Tensors map keyed by the node
   */
  function getTensorsForCurrentContenxt(name, tensorsMap, context) {
      return tensorsMap[getNodeNameWithContextId(name, context.currentContextId)];
  }
  /**
   * Returns the node name and index from the Node input name.
   * @param inputName The input name of the node, in format of
   * node_name:output_index, i.e. MatMul:0, if the output_index is not set, it is
   * default to 0.
   */
  function getNodeNameAndIndex(inputName, context) {
      const [nodeName, index] = parseNodeName(inputName);
      return [
          getNodeNameWithContextId(nodeName, context && context.currentContextId),
          index
      ];
  }
  function getNodeNameWithContextId(name, contextId) {
      return !!contextId ? `${name}-${contextId}` : name;
  }
  function parseNodeName(name) {
      const parts = name.split(':');
      if (parts.length === 1) {
          return [name, 0];
      }
      const nodeName = parts[0];
      return [nodeName, Number(parts[parts.length - 1])];
  }
  function getPadding(node, tensorMap, context) {
      let pad = getParamValue('pad', node, tensorMap, context);
      if (pad === 'explicit') {
          // This is 1d array, we need to convert it to 2d array
          pad = getParamValue('explicitPaddings', node, tensorMap, context);
          const explicitPadding = [[0, 0], [0, 0], [0, 0], [0, 0]];
          for (let i = 0; i < 4; i++) {
              explicitPadding[i][0] = pad[i * 2];
              explicitPadding[i][1] = pad[i * 2 + 1];
          }
          return explicitPadding;
      }
      return pad;
  }
  /**
   *  Reuse the tensor if it is marked as keep, otherwise clone the tensor to
   *  avoid disposal. This is important for TensorArray and TensorList ops, since
   *  internally they use a tensor as the id for TensorArray and TensorList, and
   * to simplify lookup, they also use Tensor.id as the key to the internal map.
   * These id tensors have been marked as kept in the backend, we need avoid clone
   * them in order to create new Tensor.id.
   * @param tensor
   */
  function cloneTensor(tensor) {
      return tensor.kept ? tensor : tfc.clone(tensor);
  }

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
  const json = [
      {
          'tfOpName': 'Add',
          'category': 'arithmetic',
          'inputs': [
              { 'start': 0, 'name': 'a', 'type': 'tensor' },
              { 'start': 1, 'name': 'b', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'AddV2',
          'category': 'arithmetic',
          'inputs': [
              { 'start': 0, 'name': 'a', 'type': 'tensor' },
              { 'start': 1, 'name': 'b', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'AddN',
          'category': 'arithmetic',
          'inputs': [{ 'start': 0, 'end': 0, 'name': 'tensors', 'type': 'tensors' }]
      },
      {
          'tfOpName': 'BiasAdd',
          'category': 'arithmetic',
          'inputs': [
              { 'start': 0, 'name': 'a', 'type': 'tensor' },
              { 'start': 1, 'name': 'b', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }, {
                  'tfName': 'data_format',
                  'name': 'dataFormat',
                  'type': 'string',
                  'notSupported': true
              }
          ]
      },
      {
          'tfOpName': 'Sub',
          'category': 'arithmetic',
          'inputs': [
              { 'start': 0, 'name': 'a', 'type': 'tensor' },
              { 'start': 1, 'name': 'b', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'RealDiv',
          'category': 'arithmetic',
          'inputs': [
              { 'start': 0, 'name': 'a', 'type': 'tensor' },
              { 'start': 1, 'name': 'b', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'Div',
          'category': 'arithmetic',
          'inputs': [
              { 'start': 0, 'name': 'a', 'type': 'tensor' },
              { 'start': 1, 'name': 'b', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'DivNoNan',
          'category': 'arithmetic',
          'inputs': [
              { 'start': 0, 'name': 'a', 'type': 'tensor' },
              { 'start': 1, 'name': 'b', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'FloorDiv',
          'category': 'arithmetic',
          'inputs': [
              { 'start': 0, 'name': 'a', 'type': 'tensor' },
              { 'start': 1, 'name': 'b', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'Mul',
          'category': 'arithmetic',
          'inputs': [
              { 'start': 0, 'name': 'a', 'type': 'tensor' },
              { 'start': 1, 'name': 'b', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'Maximum',
          'category': 'arithmetic',
          'inputs': [
              { 'start': 0, 'name': 'a', 'type': 'tensor' },
              { 'start': 1, 'name': 'b', 'type': 'tensor' }
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'Minimum',
          'category': 'arithmetic',
          'inputs': [
              { 'start': 0, 'name': 'a', 'type': 'tensor' },
              { 'start': 1, 'name': 'b', 'type': 'tensor' }
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'Pow',
          'category': 'arithmetic',
          'inputs': [
              { 'start': 0, 'name': 'a', 'type': 'tensor' },
              { 'start': 1, 'name': 'b', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'SquaredDifference',
          'category': 'arithmetic',
          'inputs': [
              { 'start': 0, 'name': 'a', 'type': 'tensor' },
              { 'start': 1, 'name': 'b', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'Mod',
          'category': 'arithmetic',
          'inputs': [
              { 'start': 0, 'name': 'a', 'type': 'tensor' },
              { 'start': 1, 'name': 'b', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'FloorMod',
          'category': 'arithmetic',
          'inputs': [
              { 'start': 0, 'name': 'a', 'type': 'tensor' },
              { 'start': 1, 'name': 'b', 'type': 'tensor' },
          ],
          'attrs': [{
                  'tfName': 'T',
                  'name': 'dtype',
                  'type': 'dtype',
                  'notSupported': true
              }]
      }
  ];

  var arithmetic = /*#__PURE__*/Object.freeze({
    __proto__: null,
    json: json
  });

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
  const json$1 = [
      {
          'tfOpName': 'Abs',
          'category': 'basic_math',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'Acos',
          'category': 'basic_math',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'Asin',
          'category': 'basic_math',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'Atan',
          'category': 'basic_math',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'Atan2',
          'category': 'basic_math',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
              { 'start': 1, 'name': 'y', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'Ceil',
          'category': 'basic_math',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'ClipByValue',
          'category': 'basic_math',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
              { 'start': 1, 'name': 'clipValueMin', 'type': 'number' },
              { 'start': 2, 'name': 'clipValueMax', 'type': 'number' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'Complex',
          'category': 'basic_math',
          'inputs': [
              { 'start': 0, 'name': 'real', 'type': 'tensor' },
              { 'start': 1, 'name': 'imag', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'ComplexAbs',
          'category': 'basic_math',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'Cos',
          'category': 'basic_math',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'Cosh',
          'category': 'basic_math',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'Elu',
          'category': 'basic_math',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'Exp',
          'category': 'basic_math',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'Floor',
          'category': 'basic_math',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'Log',
          'category': 'basic_math',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'Imag',
          'category': 'basic_math',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }, {
                  'tfName': 'Tout',
                  'name': 'outputType',
                  'type': 'dtype',
                  'notSupported': true
              }
          ]
      },
      {
          'tfOpName': 'Neg',
          'category': 'basic_math',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'Real',
          'category': 'basic_math',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }, {
                  'tfName': 'Tout',
                  'name': 'outputType',
                  'type': 'dtype',
                  'notSupported': true
              }
          ]
      },
      {
          'tfOpName': 'Prelu',
          'category': 'basic_math',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
              { 'start': 1, 'name': 'alpha', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'Relu',
          'category': 'basic_math',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'Relu6',
          'category': 'basic_math',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'Selu',
          'category': 'basic_math',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'Sigmoid',
          'category': 'basic_math',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'Sin',
          'category': 'basic_math',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'Sinh',
          'category': 'basic_math',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'Sqrt',
          'category': 'basic_math',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'Rsqrt',
          'category': 'basic_math',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'Square',
          'category': 'basic_math',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'Tan',
          'category': 'basic_math',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'Tanh',
          'category': 'basic_math',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'Sign',
          'category': 'basic_math',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'Round',
          'category': 'basic_math',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'Expm1',
          'category': 'basic_math',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'Log1p',
          'category': 'basic_math',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'Reciprocal',
          'category': 'basic_math',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'Softplus',
          'category': 'basic_math',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'Asinh',
          'category': 'basic_math',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'Acosh',
          'category': 'basic_math',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'Atanh',
          'category': 'basic_math',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'Erf',
          'category': 'basic_math',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'Prod',
          'category': 'basic_math',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
              { 'start': 1, 'name': 'axes', 'type': 'number[]' },
          ],
          'attrs': [
              {
                  'tfName': 'keep_dims',
                  'name': 'keepDims',
                  'type': 'bool',
                  'notSupported': true
              },
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'LeakyRelu',
          'category': 'basic_math',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
          ],
          'attrs': [
              {
                  'tfName': 'alpha',
                  'name': 'alpha',
                  'type': 'number',
                  'defaultValue': 0.2
              },
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'IsNan',
          'category': 'basic_math',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
          ],
          'attrs': [{
                  'tfName': 'T',
                  'name': 'dtype',
                  'type': 'dtype',
                  'notSupported': true
              }]
      }
  ];

  var basicMath = /*#__PURE__*/Object.freeze({
    __proto__: null,
    json: json$1
  });

  const json$2 = [
      {
          'tfOpName': 'EmptyTensorList',
          'category': 'control',
          'inputs': [
              { 'start': 0, 'name': 'elementShape', 'type': 'shape' },
              { 'start': 1, 'name': 'maxNumElements', 'type': 'number' },
          ],
          'attrs': [{ 'tfName': 'element_dtype', 'name': 'elementDType', 'type': 'dtype' }]
      },
      {
          'tfOpName': 'LoopCond',
          'category': 'control',
          'inputs': [{ 'start': 0, 'name': 'pred', 'type': 'tensor' }]
      },
      {
          'tfOpName': 'Switch',
          'category': 'control',
          'inputs': [
              { 'start': 0, 'name': 'data', 'type': 'tensor' },
              { 'start': 1, 'name': 'pred', 'type': 'tensor' }
          ]
      },
      {
          'tfOpName': 'Merge',
          'category': 'control',
          'inputs': [{ 'start': 0, 'end': 0, 'name': 'tensors', 'type': 'tensors' }]
      },
      {
          'tfOpName': 'Enter',
          'category': 'control',
          'inputs': [
              { 'start': 0, 'name': 'tensor', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true },
              { 'tfName': 'frame_name', 'name': 'frameName', 'type': 'string' },
              { 'tfName': 'is_constant', 'name': 'isConstant', 'type': 'bool' }
          ]
      },
      {
          'tfOpName': 'Exit',
          'category': 'control',
          'inputs': [
              { 'start': 0, 'name': 'tensor', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'NextIteration',
          'category': 'control',
          'inputs': [
              { 'start': 0, 'name': 'tensor', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'TensorArrayV3',
          'category': 'control',
          'inputs': [
              { 'start': 0, 'name': 'size', 'type': 'number' },
          ],
          'attrs': [
              { 'tfName': 'dtype', 'name': 'dtype', 'type': 'dtype' },
              { 'tfName': 'element_shape', 'name': 'elementShape', 'type': 'shape' },
              { 'tfName': 'dynamic_size', 'name': 'dynamicSize', 'type': 'bool' },
              { 'tfName': 'clear_after_read', 'name': 'clearAfterRead', 'type': 'bool' },
              {
                  'tfName': 'identical_element_shapes',
                  'name': 'identicalElementShapes',
                  'type': 'bool'
              },
              { 'tfName': 'tensor_array_name', 'name': 'name', 'type': 'string' }
          ]
      },
      {
          'tfOpName': 'TensorArrayWriteV3',
          'category': 'control',
          'inputs': [
              { 'start': 0, 'name': 'tensorArrayId', 'type': 'tensor' },
              { 'start': 1, 'name': 'index', 'type': 'number' },
              { 'start': 2, 'name': 'tensor', 'type': 'tensor' },
              { 'start': 3, 'name': 'flowIn', 'type': 'number' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'TensorArrayReadV3',
          'category': 'control',
          'inputs': [
              { 'start': 0, 'name': 'tensorArrayId', 'type': 'tensor' },
              { 'start': 1, 'name': 'index', 'type': 'number' },
              { 'start': 2, 'name': 'flowIn', 'type': 'number' },
          ],
          'attrs': [{
                  'tfName': 'dtype',
                  'name': 'dtype',
                  'type': 'dtype',
                  'notSupported': true
              }]
      },
      {
          'tfOpName': 'TensorArrayGatherV3',
          'category': 'control',
          'inputs': [
              { 'start': 0, 'name': 'tensorArrayId', 'type': 'tensor' },
              { 'start': 1, 'name': 'indices', 'type': 'number[]' },
              { 'start': 2, 'name': 'flowIn', 'type': 'number' },
          ],
          'attrs': [
              { 'tfName': 'dtype', 'name': 'dtype', 'type': 'dtype' },
              { 'tfName': 'element_shape', 'name': 'elementShape', 'type': 'shape' }
          ]
      },
      {
          'tfOpName': 'TensorArrayScatterV3',
          'category': 'control',
          'inputs': [
              { 'start': 0, 'name': 'tensorArrayId', 'type': 'tensor' },
              { 'start': 1, 'name': 'indices', 'type': 'number[]' },
              { 'start': 2, 'name': 'tensor', 'type': 'tensor' },
              { 'start': 3, 'name': 'flowIn', 'type': 'number' },
          ],
          'attrs': [{ 'tfName': 'T', 'name': 'dtype', 'type': 'dtype' }]
      },
      {
          'tfOpName': 'TensorArrayConcatV3',
          'category': 'control',
          'inputs': [
              { 'start': 0, 'name': 'tensorArrayId', 'type': 'tensor' },
              { 'start': 1, 'name': 'flowIn', 'type': 'number' },
          ],
          'attrs': [
              { 'tfName': 'dtype', 'name': 'dtype', 'type': 'dtype' }, {
                  'tfName': 'element_shape_except0',
                  'name': 'elementShapeExcept0',
                  'type': 'shape',
                  'notSupported': true
              }
          ]
      },
      {
          'tfOpName': 'TensorArraySplitV3',
          'category': 'control',
          'inputs': [
              { 'start': 0, 'name': 'tensorArrayId', 'type': 'tensor' },
              { 'start': 1, 'name': 'tensor', 'type': 'tensor' },
              { 'start': 2, 'name': 'lengths', 'type': 'number[]' },
              { 'start': 3, 'name': 'flowIn', 'type': 'number' },
          ],
          'attrs': [{ 'tfName': 'T', 'name': 'dtype', 'type': 'dtype' }]
      },
      {
          'tfOpName': 'TensorArraySizeV3',
          'category': 'control',
          'inputs': [
              { 'start': 0, 'name': 'tensorArrayId', 'type': 'tensor' },
              { 'start': 1, 'name': 'flowIn', 'type': 'number' }
          ]
      },
      {
          'tfOpName': 'TensorArrayCloseV3',
          'category': 'control',
          'inputs': [{ 'start': 0, 'name': 'tensorArrayId', 'type': 'tensor' }]
      },
      {
          'tfOpName': 'StatelessIf',
          'category': 'control',
          'inputs': [
              { 'start': 0, 'name': 'cond', 'type': 'tensor' },
              { 'start': 1, 'end': 0, 'name': 'args', 'type': 'tensors' }
          ],
          'attrs': [
              { 'tfName': 'then_branch', 'name': 'thenBranch', 'type': 'func' },
              { 'tfName': 'else_branch', 'name': 'elseBranch', 'type': 'func' }
          ]
      },
      {
          'tfOpName': 'If',
          'category': 'control',
          'inputs': [
              { 'start': 0, 'name': 'cond', 'type': 'tensor' },
              { 'start': 1, 'end': 0, 'name': 'args', 'type': 'tensors' }
          ],
          'attrs': [
              { 'tfName': 'then_branch', 'name': 'thenBranch', 'type': 'func' },
              { 'tfName': 'else_branch', 'name': 'elseBranch', 'type': 'func' }
          ]
      },
      {
          'tfOpName': 'StatelessWhile',
          'category': 'control',
          'inputs': [
              { 'start': 0, 'end': 0, 'name': 'args', 'type': 'tensors' },
          ],
          'attrs': [
              { 'tfName': 'cond', 'name': 'cond', 'type': 'func' },
              { 'tfName': 'body', 'name': 'body', 'type': 'func' }
          ]
      },
      {
          'tfOpName': 'While',
          'category': 'control',
          'inputs': [
              { 'start': 0, 'end': 0, 'name': 'args', 'type': 'tensors' },
          ],
          'attrs': [
              { 'tfName': 'cond', 'name': 'cond', 'type': 'func' },
              { 'tfName': 'body', 'name': 'body', 'type': 'func' }
          ]
      },
      {
          'tfOpName': 'TensorListScatter',
          'category': 'control',
          'inputs': [
              { 'start': 0, 'name': 'tensor', 'type': 'tensor' },
              { 'start': 1, 'name': 'indices', 'type': 'number[]' },
              { 'start': 2, 'name': 'elementShape', 'type': 'shape' }
          ],
          'attrs': [{ 'tfName': 'element_dtype', 'name': 'elementDType', 'type': 'dtype' }]
      },
      {
          'tfOpName': 'TensorListScatterV2',
          'category': 'control',
          'inputs': [
              { 'start': 0, 'name': 'tensor', 'type': 'tensor' },
              { 'start': 1, 'name': 'indices', 'type': 'number[]' },
              { 'start': 2, 'name': 'elementShape', 'type': 'shape' },
              { 'start': 3, 'name': 'numElements', 'type': 'number' },
          ],
          'attrs': [{ 'tfName': 'element_dtype', 'name': 'elementDType', 'type': 'dtype' }]
      },
      {
          'tfOpName': 'TensorListGather',
          'category': 'control',
          'inputs': [
              { 'start': 0, 'name': 'tensorListId', 'type': 'tensor' },
              { 'start': 1, 'name': 'indices', 'type': 'number[]' },
              { 'start': 2, 'name': 'elementShape', 'type': 'shape' },
          ],
          'attrs': [{ 'tfName': 'element_dtype', 'name': 'elementDType', 'type': 'dtype' }]
      },
      {
          'tfOpName': 'TensorListGetItem',
          'category': 'control',
          'inputs': [
              { 'start': 0, 'name': 'tensorListId', 'type': 'tensor' },
              { 'start': 1, 'name': 'index', 'type': 'number' },
              { 'start': 2, 'name': 'elementShape', 'type': 'shape' },
          ],
          'attrs': [{ 'tfName': 'element_dtype', 'name': 'elementDType', 'type': 'dtype' }]
      },
      {
          'tfOpName': 'TensorListSetItem',
          'category': 'control',
          'inputs': [
              { 'start': 0, 'name': 'tensorListId', 'type': 'tensor' },
              { 'start': 1, 'name': 'index', 'type': 'number' },
              { 'start': 2, 'name': 'tensor', 'type': 'tensor' },
          ],
          'attrs': [{ 'tfName': 'element_dtype', 'name': 'elementDType', 'type': 'dtype' }]
      },
      {
          'tfOpName': 'TensorListReserve',
          'category': 'control',
          'inputs': [
              { 'start': 0, 'name': 'elementShape', 'type': 'shape' },
              { 'start': 1, 'name': 'numElements', 'type': 'number' },
          ],
          'attrs': [{ 'tfName': 'element_dtype', 'name': 'elementDType', 'type': 'dtype' }]
      },
      {
          'tfOpName': 'TensorListFromTensor',
          'category': 'control',
          'inputs': [
              { 'start': 0, 'name': 'tensor', 'type': 'tensor' },
              { 'start': 1, 'name': 'elementShape', 'type': 'shape' }
          ],
          'attrs': [{ 'tfName': 'element_dtype', 'name': 'elementDType', 'type': 'dtype' }]
      },
      {
          'tfOpName': 'TensorListStack',
          'category': 'control',
          'inputs': [
              { 'start': 0, 'name': 'tensorListId', 'type': 'tensor' },
              { 'start': 1, 'name': 'elementShape', 'type': 'shape' },
          ],
          'attrs': [
              { 'tfName': 'element_dtype', 'name': 'elementDType', 'type': 'dtype' },
              { 'tfName': 'num_elements', 'name': 'numElements', 'type': 'dtype' }
          ]
      },
      {
          'tfOpName': 'TensorListSplit',
          'category': 'control',
          'inputs': [
              { 'start': 0, 'name': 'tensor', 'type': 'tensor' },
              { 'start': 1, 'name': 'elementShape', 'type': 'shape' },
              { 'start': 2, 'name': 'lengths', 'type': 'number[]' },
          ],
          'attrs': [{ 'tfName': 'element_dtype', 'name': 'elementDType', 'type': 'dtype' }]
      },
      {
          'tfOpName': 'TensorListConcat',
          'category': 'control',
          'inputs': [
              { 'start': 0, 'name': 'tensorListId', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'element_shape', 'name': 'elementShape', 'type': 'shape' },
              { 'tfName': 'element_dtype', 'name': 'elementDType', 'type': 'dtype' }
          ]
      },
      {
          'tfOpName': 'TensorListPopBack',
          'category': 'control',
          'inputs': [
              { 'start': 0, 'name': 'tensorListId', 'type': 'tensor' },
              { 'start': 1, 'name': 'elementShape', 'type': 'shape' },
          ],
          'attrs': [{ 'tfName': 'element_dtype', 'name': 'elementDType', 'type': 'dtype' }]
      },
      {
          'tfOpName': 'TensorListPushBack',
          'category': 'control',
          'inputs': [
              { 'start': 0, 'name': 'tensorListId', 'type': 'tensor' },
              { 'start': 1, 'name': 'tensor', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'element_dtype', 'name': 'elementDType', 'type': 'dtype' }
          ]
      }
  ];

  var control = /*#__PURE__*/Object.freeze({
    __proto__: null,
    json: json$2
  });

  /**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
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
  const json$3 = [
      {
          'tfOpName': 'AvgPool',
          'category': 'convolution',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'strides', 'name': 'strides', 'type': 'number[]' },
              { 'tfName': 'padding', 'name': 'pad', 'type': 'string' }, {
                  'tfName': 'data_format',
                  'name': 'dataFormat',
                  'type': 'string',
                  'notSupported': true
              },
              { 'tfName': 'ksize', 'name': 'kernelSize', 'type': 'number[]' },
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'MaxPool',
          'category': 'convolution',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'strides', 'name': 'strides', 'type': 'number[]' },
              { 'tfName': 'padding', 'name': 'pad', 'type': 'string' }, {
                  'tfName': 'data_format',
                  'name': 'dataFormat',
                  'type': 'string',
                  'notSupported': true
              },
              { 'tfName': 'ksize', 'name': 'kernelSize', 'type': 'number[]' }, {
                  'tfName': 'explicit_paddings',
                  'name': 'explicitPaddings',
                  'type': 'number[]',
                  'defaultValue': [],
                  'notSupported': true
              },
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'MaxPoolWithArgmax',
          'category': 'convolution',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'strides', 'name': 'strides', 'type': 'number[]' },
              { 'tfName': 'padding', 'name': 'pad', 'type': 'string' },
              { 'tfName': 'ksize', 'name': 'kernelSize', 'type': 'number[]' }, {
                  'tfName': 'include_batch_in_index',
                  'name': 'includeBatchInIndex',
                  'type': 'bool'
              },
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'AvgPool3D',
          'category': 'convolution',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'strides', 'name': 'strides', 'type': 'number[]' },
              { 'tfName': 'padding', 'name': 'pad', 'type': 'string' }, {
                  'tfName': 'data_format',
                  'name': 'dataFormat',
                  'type': 'string',
                  'notSupported': true
              },
              { 'tfName': 'ksize', 'name': 'kernelSize', 'type': 'number[]' },
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'MaxPool3D',
          'category': 'convolution',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'strides', 'name': 'strides', 'type': 'number[]' },
              { 'tfName': 'padding', 'name': 'pad', 'type': 'string' }, {
                  'tfName': 'data_format',
                  'name': 'dataFormat',
                  'type': 'string',
                  'notSupported': true
              },
              { 'tfName': 'ksize', 'name': 'kernelSize', 'type': 'number[]' },
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'Conv1D',
          'category': 'convolution',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
              { 'start': 1, 'name': 'filter', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'stride', 'name': 'stride', 'type': 'number' },
              { 'tfName': 'padding', 'name': 'pad', 'type': 'string' }, {
                  'tfName': 'data_format',
                  'name': 'dataFormat',
                  'type': 'string',
                  'defaultValue': 'NWC'
              },
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }, {
                  'tfName': 'dilation',
                  'name': 'dilation',
                  'type': 'number',
                  'defaultValue': 1
              }
          ]
      },
      {
          'tfOpName': 'Conv2D',
          'category': 'convolution',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
              { 'start': 1, 'name': 'filter', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true },
              { 'tfName': 'strides', 'name': 'strides', 'type': 'number[]' },
              { 'tfName': 'padding', 'name': 'pad', 'type': 'string' },
              { 'tfName': 'useCudnnOnGpu', 'name': 'useCudnnOnGpu', 'type': 'bool' }, {
                  'tfName': 'data_format',
                  'name': 'dataFormat',
                  'type': 'string',
                  'defaultValue': 'NHWC'
              },
              {
                  'tfName': 'explicit_paddings',
                  'name': 'explicitPaddings',
                  'type': 'number[]',
                  'defaultValue': []
              },
              { 'tfName': 'dilations', 'name': 'dilations', 'type': 'number[]' }
          ]
      },
      {
          'tfOpName': '_FusedConv2D',
          'category': 'convolution',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
              { 'start': 1, 'name': 'filter', 'type': 'tensor' },
              { 'start': 2, end: 0, 'name': 'args', 'type': 'tensors' },
          ],
          'attrs': [
              { 'tfName': 'num_args', 'name': 'numArgs', 'type': 'number' },
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true },
              { 'tfName': 'strides', 'name': 'strides', 'type': 'number[]' },
              { 'tfName': 'padding', 'name': 'pad', 'type': 'string' }, {
                  'tfName': 'explicit_paddings',
                  'name': 'explicitPaddings',
                  'type': 'number[]',
                  'defaultValue': []
              },
              {
                  'tfName': 'use_cudnn_on_gpu',
                  'name': 'useCudnnOnGpu',
                  'type': 'bool',
                  'defaultValue': true
              },
              {
                  'tfName': 'data_format',
                  'name': 'dataFormat',
                  'type': 'string',
                  'defaultValue': 'NHWC'
              },
              {
                  'tfName': 'dilations',
                  'name': 'dilations',
                  'type': 'number[]',
                  'defaultValue': [1, 1, 1, 1]
              },
              {
                  'tfName': 'fused_ops',
                  'name': 'fusedOps',
                  'type': 'string[]',
                  'defaultValue': []
              },
              {
                  'tfName': 'epsilon',
                  'name': 'epsilon',
                  'type': 'number',
                  'defaultValue': 0.0001
              },
              {
                  'tfName': 'leakyrelu_alpha',
                  'name': 'leakyreluAlpha',
                  'type': 'number'
              }
          ]
      },
      {
          'tfOpName': 'Conv2DBackpropInput',
          'category': 'convolution',
          'inputs': [
              { 'start': 2, 'name': 'x', 'type': 'tensor' },
              { 'start': 1, 'name': 'filter', 'type': 'tensor' },
              { 'start': 0, 'name': 'outputShape', 'type': 'number[]' },
          ],
          'attrs': [
              { 'tfName': 'strides', 'name': 'strides', 'type': 'number[]' },
              { 'tfName': 'padding', 'name': 'pad', 'type': 'string' }, {
                  'tfName': 'data_format',
                  'name': 'dataFormat',
                  'type': 'string',
                  'notSupported': true
              },
              {
                  'tfName': 'explicit_paddings',
                  'name': 'explicitPaddings',
                  'type': 'number[]',
                  'defaultValue': []
              },
              {
                  'tfName': 'dilations',
                  'name': 'dilations',
                  'type': 'number[]',
                  'notSupported': true
              }
          ]
      },
      {
          'tfOpName': 'DepthwiseConv2d',
          'category': 'convolution',
          'inputs': [
              { 'start': 0, 'name': 'input', 'type': 'tensor' },
              { 'start': 1, 'name': 'filter', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'strides', 'name': 'strides', 'type': 'number[]' },
              { 'tfName': 'padding', 'name': 'pad', 'type': 'string' }, {
                  'tfName': 'data_format',
                  'name': 'dataFormat',
                  'type': 'string',
                  'defaultValue': 'NHWC'
              },
              {
                  'tfName': 'explicit_paddings',
                  'name': 'explicitPaddings',
                  'type': 'number[]',
                  'defaultValue': []
              },
              { 'tfName': 'dilations', 'name': 'dilations', 'type': 'number[]' }
          ]
      },
      {
          'tfOpName': 'DepthwiseConv2dNative',
          'category': 'convolution',
          'inputs': [
              { 'start': 0, 'name': 'input', 'type': 'tensor' },
              { 'start': 1, 'name': 'filter', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'strides', 'name': 'strides', 'type': 'number[]' },
              { 'tfName': 'padding', 'name': 'pad', 'type': 'string' }, {
                  'tfName': 'data_format',
                  'name': 'dataFormat',
                  'type': 'string',
                  'defaultValue': 'NHWC'
              },
              {
                  'tfName': 'explicit_paddings',
                  'name': 'explicitPaddings',
                  'type': 'number[]',
                  'defaultValue': []
              },
              { 'tfName': 'dilations', 'name': 'dilations', 'type': 'number[]' }
          ]
      },
      {
          'tfOpName': 'FusedDepthwiseConv2dNative',
          'category': 'convolution',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
              { 'start': 1, 'name': 'filter', 'type': 'tensor' },
              { 'start': 2, end: 0, 'name': 'args', 'type': 'tensors' },
          ],
          'attrs': [
              { 'tfName': 'num_args', 'name': 'numArgs', 'type': 'number' },
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true },
              { 'tfName': 'strides', 'name': 'strides', 'type': 'number[]' },
              { 'tfName': 'padding', 'name': 'pad', 'type': 'string' }, {
                  'tfName': 'data_format',
                  'name': 'dataFormat',
                  'type': 'string',
                  'defaultValue': 'NHWC'
              },
              {
                  'tfName': 'dilations',
                  'name': 'dilations',
                  'type': 'number[]',
                  'defaultValue': [1, 1, 1, 1]
              },
              {
                  'tfName': 'fused_ops',
                  'name': 'fusedOps',
                  'type': 'string[]',
                  'defaultValue': []
              },
              {
                  'tfName': 'explicit_paddings',
                  'name': 'explicitPaddings',
                  'type': 'number[]',
                  'defaultValue': []
              }
          ]
      },
      {
          'tfOpName': 'Conv3D',
          'category': 'convolution',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
              { 'start': 1, 'name': 'filter', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'strides', 'name': 'strides', 'type': 'number[]' },
              { 'tfName': 'padding', 'name': 'pad', 'type': 'string' }, {
                  'tfName': 'data_format',
                  'name': 'dataFormat',
                  'type': 'string',
                  'defaultValue': 'NHWC'
              },
              { 'tfName': 'dilations', 'name': 'dilations', 'type': 'number[]' }
          ],
      },
      {
          'tfOpName': 'Dilation2D',
          'category': 'convolution',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
              { 'start': 1, 'name': 'filter', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'strides', 'name': 'strides', 'type': 'number[]' },
              { 'tfName': 'rates', 'name': 'dilations', 'type': 'number[]' },
              { 'tfName': 'padding', 'name': 'pad', 'type': 'string' }
          ]
      }
  ];

  var convolution = /*#__PURE__*/Object.freeze({
    __proto__: null,
    json: json$3
  });

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
  const json$4 = [
      {
          'tfOpName': 'Fill',
          'category': 'creation',
          'inputs': [
              { 'start': 0, 'name': 'shape', 'type': 'number[]' },
              { 'start': 1, 'name': 'value', 'type': 'number' },
          ],
          'attrs': [{ 'tfName': 'T', 'name': 'dtype', 'type': 'dtype' }]
      },
      {
          'tfOpName': 'LinSpace',
          'category': 'creation',
          'inputs': [
              { 'start': 0, 'name': 'start', 'type': 'number' },
              { 'start': 1, 'name': 'stop', 'type': 'number' },
              { 'start': 2, 'name': 'num', 'type': 'number' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'OneHot',
          'category': 'creation',
          'inputs': [
              { 'start': 0, 'name': 'indices', 'type': 'tensor' },
              { 'start': 1, 'name': 'depth', 'type': 'number' },
              { 'start': 2, 'name': 'onValue', 'type': 'number', 'defaultValue': 1 },
              { 'start': 3, 'name': 'offValue', 'type': 'number', 'defaultValue': 0 },
          ],
          'attrs': [
              {
                  'tfName': 'axis',
                  'name': 'axis',
                  'type': 'number',
                  'notSupported': true
              },
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'Ones',
          'category': 'creation',
          'inputs': [
              { 'start': 0, 'name': 'shape', 'type': 'number[]' },
          ],
          'attrs': [{ 'tfName': 'T', 'name': 'dtype', 'type': 'dtype' }]
      },
      {
          'tfOpName': 'OnesLike',
          'category': 'creation',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
          ],
          'attrs': [{ 'tfName': 'dtype', 'name': 'dtype', 'type': 'dtype' }]
      },
      {
          'tfOpName': 'RandomUniform',
          'category': 'creation',
          'inputs': [
              { 'start': 0, 'name': 'shape', 'type': 'number[]' },
          ],
          'attrs': [
              {
                  'tfName': 'minval',
                  'name': 'minval',
                  'type': 'number',
                  'defaultValue': 0
              },
              {
                  'tfName': 'maxval',
                  'name': 'maxval',
                  'type': 'number',
                  'defaultValue': 1
              },
              { 'tfName': 'dtype', 'name': 'dtype', 'type': 'dtype' },
              { 'tfName': 'seed', 'name': 'seed', 'type': 'number', 'defaultValue': 0 }, {
                  'tfName': 'seed2',
                  'name': 'seed2',
                  'type': 'number',
                  'defaultValue': 0,
                  'notSupported': true
              },
              { 'tfName': 'T', 'name': 'T', 'type': 'number', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'Range',
          'category': 'creation',
          'inputs': [
              { 'start': 0, 'name': 'start', 'type': 'number' },
              { 'start': 1, 'name': 'stop', 'type': 'number' },
              { 'start': 2, 'name': 'step', 'type': 'number', 'defaultValue': 0 },
          ],
          'attrs': [{ 'tfName': 'Tidx', 'name': 'dtype', 'type': 'dtype' }]
      },
      {
          'tfOpName': 'TruncatedNormal',
          'category': 'creation',
          'inputs': [
              { 'start': 0, 'name': 'shape', 'type': 'number[]' },
          ],
          'attrs': [
              {
                  'tfName': 'means',
                  'name': 'mean',
                  'type': 'number',
                  'defaultValue': 0.0
              },
              {
                  'tfName': 'stddev',
                  'name': 'stdDev',
                  'type': 'number',
                  'defaultValue': 1.0
              },
              { 'tfName': 'seed', 'name': 'seed', 'type': 'number' }, {
                  'tfName': 'seed2',
                  'name': 'seed2',
                  'type': 'number',
                  'defaultValue': 0,
                  'notSupported': true
              },
              { 'tfName': 'dtype', 'name': 'dtype', 'type': 'dtype' },
              { 'tfName': 'T', 'name': 'T', 'type': 'number', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'Zeros',
          'category': 'creation',
          'inputs': [
              { 'start': 0, 'name': 'shape', 'type': 'number[]' },
          ],
          'attrs': [{ 'tfName': 'T', 'name': 'dtype', 'type': 'dtype' }]
      },
      {
          'tfOpName': 'ZerosLike',
          'category': 'creation',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
          ],
          'attrs': [{ 'tfName': 'T', 'name': 'dtype', 'type': 'dtype' }]
      },
      {
          'tfOpName': 'Multinomial',
          'category': 'creation',
          'inputs': [
              { 'start': 0, 'name': 'logits', 'type': 'tensor' },
              { 'start': 1, 'name': 'numSamples', 'type': 'number' },
          ],
          'attrs': [
              { 'tfName': 'seed', 'name': 'seed', 'type': 'number' },
              { 'tfName': 'seed2', 'name': 'seed2', 'type': 'number' },
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype' },
              { 'tfName': 'output_dtype', 'name': 'output_dtype', 'type': 'dtype' }
          ]
      }
  ];

  var creation = /*#__PURE__*/Object.freeze({
    __proto__: null,
    json: json$4
  });

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
  const json$5 = [
      {
          'tfOpName': 'NonMaxSuppressionV2',
          'category': 'dynamic',
          'inputs': [
              { 'start': 0, 'name': 'boxes', 'type': 'tensor' },
              { 'start': 1, 'name': 'scores', 'type': 'tensor' },
              { 'start': 2, 'name': 'maxOutputSize', 'type': 'number' },
              { 'start': 3, 'name': 'iouThreshold', 'type': 'number' }
          ]
      },
      {
          'tfOpName': 'NonMaxSuppressionV3',
          'category': 'dynamic',
          'inputs': [
              { 'start': 0, 'name': 'boxes', 'type': 'tensor' },
              { 'start': 1, 'name': 'scores', 'type': 'tensor' },
              { 'start': 2, 'name': 'maxOutputSize', 'type': 'number' },
              { 'start': 3, 'name': 'iouThreshold', 'type': 'number' },
              { 'start': 4, 'name': 'scoreThreshold', 'type': 'number' }
          ]
      },
      {
          'tfOpName': 'NonMaxSuppressionV4',
          'category': 'dynamic',
          'inputs': [
              { 'start': 0, 'name': 'boxes', 'type': 'tensor' },
              { 'start': 1, 'name': 'scores', 'type': 'tensor' },
              { 'start': 2, 'name': 'maxOutputSize', 'type': 'number' },
              { 'start': 3, 'name': 'iouThreshold', 'type': 'number' },
              { 'start': 4, 'name': 'scoreThreshold', 'type': 'number' }
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }, {
                  'tfName': 'T_threshold',
                  'name': 'threshold',
                  'type': 'dtype',
                  'notSupported': true
              },
              {
                  'tfName': 'pad_to_max_output_size',
                  'name': 'padToMaxOutputSize',
                  'type': 'bool'
              }
          ]
      },
      {
          'tfOpName': 'NonMaxSuppressionV5',
          'category': 'dynamic',
          'inputs': [
              { 'start': 0, 'name': 'boxes', 'type': 'tensor' },
              { 'start': 1, 'name': 'scores', 'type': 'tensor' },
              { 'start': 2, 'name': 'maxOutputSize', 'type': 'number' },
              { 'start': 3, 'name': 'iouThreshold', 'type': 'number' },
              { 'start': 4, 'name': 'scoreThreshold', 'type': 'number' },
              { 'start': 5, 'name': 'softNmsSigma', 'type': 'number' }
          ]
      },
      {
          'tfOpName': 'Where',
          'category': 'dynamic',
          'inputs': [
              { 'start': 0, 'name': 'condition', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'ListDiff',
          'category': 'dynamic',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
              { 'start': 1, 'name': 'y', 'type': 'tensor' },
          ],
          'attrs': [{
                  'tfName': 'T',
                  'name': 'dtype',
                  'type': 'dtype',
                  'notSupported': true
              }]
      }
  ];

  var dynamic = /*#__PURE__*/Object.freeze({
    __proto__: null,
    json: json$5
  });

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
  const json$6 = [
      {
          'tfOpName': 'TopKV2',
          'category': 'evaluation',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
              { 'start': 1, 'name': 'k', 'type': 'number' },
          ],
          'attrs': [{ 'tfName': 'sorted', 'name': 'sorted', 'type': 'bool' }]
      },
      {
          'tfOpName': 'Unique',
          'category': 'evaluation',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
          ],
      },
      {
          'tfOpName': 'UniqueV2',
          'category': 'evaluation',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
              { 'start': 1, 'name': 'axis', 'type': 'number' },
          ],
      },
  ];

  var evaluation = /*#__PURE__*/Object.freeze({
    __proto__: null,
    json: json$6
  });

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
  const json$7 = [
      {
          'tfOpName': 'PlaceholderWithDefault',
          'category': 'graph',
          'inputs': [
              { 'start': 0, 'name': 'default', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'shape', 'name': 'shape', 'type': 'shape' },
              { 'tfName': 'dtype', 'name': 'dtype', 'type': 'dtype' }
          ]
      },
      {
          'tfOpName': 'Placeholder',
          'category': 'graph',
          'attrs': [
              { 'tfName': 'shape', 'name': 'shape', 'type': 'shape' },
              { 'tfName': 'dtype', 'name': 'dtype', 'type': 'dtype' }
          ]
      },
      { 'tfOpName': 'Const', 'category': 'graph' }, {
          'tfOpName': 'Identity',
          'category': 'graph',
          'inputs': [{ 'start': 0, 'name': 'x', 'type': 'tensor' }]
      },
      {
          'tfOpName': 'IdentityN',
          'category': 'graph',
          'inputs': [{ 'start': 0, 'end': 0, 'name': 'x', 'type': 'tensors' }]
      },
      {
          'tfOpName': 'Snapshot',
          'category': 'graph',
          'inputs': [{ 'start': 0, 'name': 'x', 'type': 'tensor' }]
      },
      {
          'tfOpName': 'Rank',
          'category': 'graph',
          'inputs': [{ 'start': 0, 'name': 'x', 'type': 'tensor' }]
      },
      {
          'tfOpName': 'Size',
          'category': 'graph',
          'inputs': [{ 'start': 0, 'name': 'x', 'type': 'tensor' }]
      },
      {
          'tfOpName': 'Shape',
          'category': 'graph',
          'inputs': [{ 'start': 0, 'name': 'x', 'type': 'tensor' }]
      },
      {
          'tfOpName': 'ShapeN',
          'category': 'graph',
          'inputs': [{ 'start': 0, 'end': 0, 'name': 'x', 'type': 'tensors' }]
      },
      {
          'tfOpName': 'Print',
          'category': 'graph',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
              { 'start': 1, 'name': 'data', 'type': 'tensors' },
          ],
          'attrs': [
              { 'tfName': 'message', 'name': 'message', 'type': 'string' }, {
                  'tfName': 'first_n',
                  'name': 'firstN',
                  'type': 'number',
                  'notSupported': true
              },
              {
                  'tfName': 'summarize',
                  'name': 'summarize',
                  'type': 'number',
                  'defaultValue': 3
              }
          ]
      },
      { 'tfOpName': 'NoOp', 'category': 'graph', 'inputs': [] }, {
          'tfOpName': 'StopGradient',
          'category': 'graph',
          'inputs': [{ 'start': 0, 'name': 'x', 'type': 'tensor' }]
      },
      {
          'tfOpName': 'FakeQuantWithMinMaxVars',
          'category': 'graph',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'min', 'name': 'min', 'type': 'number' },
              { 'tfName': 'max', 'name': 'max', 'type': 'number' }
          ]
      }
  ];

  var graph = /*#__PURE__*/Object.freeze({
    __proto__: null,
    json: json$7
  });

  const json$8 = [
      {
          'tfOpName': 'HashTable',
          'category': 'hash_table',
          'inputs': [],
          'attrs': [
              { 'tfName': 'shared_name', 'name': 'sharedName', 'type': 'string' },
              {
                  'tfName': 'use_node_name_sharing',
                  'name': 'useNodeNameSharing',
                  'type': 'bool'
              },
              { 'tfName': 'key_dtype', 'name': 'keyDType', 'type': 'dtype' },
              { 'tfName': 'value_dtype', 'name': 'valueDType', 'type': 'dtype' },
          ]
      },
      {
          'tfOpName': 'HashTableV2',
          'category': 'hash_table',
          'inputs': [],
          'attrs': [
              { 'tfName': 'shared_name', 'name': 'sharedName', 'type': 'string' },
              {
                  'tfName': 'use_node_name_sharing',
                  'name': 'useNodeNameSharing',
                  'type': 'bool'
              },
              { 'tfName': 'key_dtype', 'name': 'keyDType', 'type': 'dtype' },
              { 'tfName': 'value_dtype', 'name': 'valueDType', 'type': 'dtype' },
          ]
      },
      {
          'tfOpName': 'LookupTableImport',
          'category': 'hash_table',
          'inputs': [
              { 'start': 0, 'name': 'tableHandle', 'type': 'tensor' },
              { 'start': 1, 'name': 'keys', 'type': 'tensor' },
              { 'start': 2, 'name': 'values', 'type': 'tensor' }
          ],
          'attrs': [
              { 'tfName': 'Tin', 'name': 'tIn', 'type': 'dtype', 'notSupported': true }, {
                  'tfName': 'Tout',
                  'name': 'tOut',
                  'type': 'dtype',
                  'notSupported': true
              }
          ]
      },
      {
          'tfOpName': 'LookupTableImportV2',
          'category': 'hash_table',
          'inputs': [
              { 'start': 0, 'name': 'tableHandle', 'type': 'tensor' },
              { 'start': 1, 'name': 'keys', 'type': 'tensor' },
              { 'start': 2, 'name': 'values', 'type': 'tensor' }
          ],
          'attrs': [
              { 'tfName': 'Tin', 'name': 'tIn', 'type': 'dtype', 'notSupported': true }, {
                  'tfName': 'Tout',
                  'name': 'tOut',
                  'type': 'dtype',
                  'notSupported': true
              }
          ]
      },
      {
          'tfOpName': 'LookupTableFind',
          'category': 'hash_table',
          'inputs': [
              { 'start': 0, 'name': 'tableHandle', 'type': 'tensor' },
              { 'start': 1, 'name': 'keys', 'type': 'tensor' },
              { 'start': 2, 'name': 'defaultValue', 'type': 'tensor' }
          ],
          'attrs': [
              { 'tfName': 'Tin', 'name': 'tIn', 'type': 'dtype', 'notSupported': true }, {
                  'tfName': 'Tout',
                  'name': 'tOut',
                  'type': 'dtype',
                  'notSupported': true
              }
          ]
      },
      {
          'tfOpName': 'LookupTableFindV2',
          'category': 'hash_table',
          'inputs': [
              { 'start': 0, 'name': 'tableHandle', 'type': 'tensor' },
              { 'start': 1, 'name': 'keys', 'type': 'tensor' },
              { 'start': 2, 'name': 'defaultValue', 'type': 'tensor' }
          ],
          'attrs': [
              { 'tfName': 'Tin', 'name': 'tIn', 'type': 'dtype', 'notSupported': true }, {
                  'tfName': 'Tout',
                  'name': 'tOut',
                  'type': 'dtype',
                  'notSupported': true
              }
          ]
      },
      {
          'tfOpName': 'LookupTableSize',
          'category': 'hash_table',
          'inputs': [
              { 'start': 0, 'name': 'tableHandle', 'type': 'tensor' }
          ]
      },
      {
          'tfOpName': 'LookupTableSizeV2',
          'category': 'hash_table',
          'inputs': [
              { 'start': 0, 'name': 'tableHandle', 'type': 'tensor' }
          ]
      }
  ];

  var hashTable = /*#__PURE__*/Object.freeze({
    __proto__: null,
    json: json$8
  });

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
  const json$9 = [
      {
          'tfOpName': 'ResizeBilinear',
          'category': 'image',
          'inputs': [
              { 'start': 0, 'name': 'images', 'type': 'tensor' },
              { 'start': 1, 'name': 'size', 'type': 'number[]' },
          ],
          'attrs': [
              { 'tfName': 'align_corners', 'name': 'alignCorners', 'type': 'bool' }, {
                  'tfName': 'half_pixel_centers',
                  'name': 'halfPixelCenters',
                  'type': 'bool'
              },
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'ResizeNearestNeighbor',
          'category': 'image',
          'inputs': [
              { 'start': 0, 'name': 'images', 'type': 'tensor' },
              { 'start': 1, 'name': 'size', 'type': 'number[]' },
          ],
          'attrs': [
              { 'tfName': 'align_corners', 'name': 'alignCorners', 'type': 'bool' }, {
                  'tfName': 'half_pixel_centers',
                  'name': 'halfPixelCenters',
                  'type': 'bool'
              },
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'CropAndResize',
          'category': 'image',
          'inputs': [
              { 'start': 0, 'name': 'image', 'type': 'tensor' },
              { 'start': 1, 'name': 'boxes', 'type': 'tensor' },
              { 'start': 2, 'name': 'boxInd', 'type': 'tensor' },
              { 'start': 3, 'name': 'cropSize', 'type': 'number[]' },
          ],
          'attrs': [
              { 'tfName': 'method', 'name': 'method', 'type': 'string' }, {
                  'tfName': 'extrapolation_value',
                  'name': 'extrapolationValue',
                  'type': 'number'
              }
          ]
      }
  ];

  var image = /*#__PURE__*/Object.freeze({
    __proto__: null,
    json: json$9
  });

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
  const json$a = [
      {
          'tfOpName': 'Equal',
          'category': 'logical',
          'inputs': [
              { 'start': 0, 'name': 'a', 'type': 'tensor' },
              { 'start': 1, 'name': 'b', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'NotEqual',
          'category': 'logical',
          'inputs': [
              { 'start': 0, 'name': 'a', 'type': 'tensor' },
              { 'start': 1, 'name': 'b', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'Greater',
          'category': 'logical',
          'inputs': [
              { 'start': 0, 'name': 'a', 'type': 'tensor' },
              { 'start': 1, 'name': 'b', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'GreaterEqual',
          'category': 'logical',
          'inputs': [
              { 'start': 0, 'name': 'a', 'type': 'tensor' },
              { 'start': 1, 'name': 'b', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'Less',
          'category': 'logical',
          'inputs': [
              { 'start': 0, 'name': 'a', 'type': 'tensor' },
              { 'start': 1, 'name': 'b', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'LessEqual',
          'category': 'logical',
          'inputs': [
              { 'start': 0, 'name': 'a', 'type': 'tensor' },
              { 'start': 1, 'name': 'b', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'LogicalAnd',
          'category': 'logical',
          'inputs': [
              { 'start': 0, 'name': 'a', 'type': 'tensor' },
              { 'start': 1, 'name': 'b', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'LogicalNot',
          'category': 'logical',
          'inputs': [
              { 'start': 0, 'name': 'a', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'LogicalOr',
          'category': 'logical',
          'inputs': [
              { 'start': 0, 'name': 'a', 'type': 'tensor' },
              { 'start': 1, 'name': 'b', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'Select',
          'category': 'logical',
          'inputs': [
              { 'start': 0, 'name': 'condition', 'type': 'tensor' },
              { 'start': 1, 'name': 'a', 'type': 'tensor' },
              { 'start': 2, 'name': 'b', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'SelectV2',
          'category': 'logical',
          'inputs': [
              { 'start': 0, 'name': 'condition', 'type': 'tensor' },
              { 'start': 1, 'name': 'a', 'type': 'tensor' },
              { 'start': 2, 'name': 'b', 'type': 'tensor' },
          ],
          'attrs': [{
                  'tfName': 'T',
                  'name': 'dtype',
                  'type': 'dtype',
                  'notSupported': true
              }]
      }
  ];

  var logical = /*#__PURE__*/Object.freeze({
    __proto__: null,
    json: json$a
  });

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
  const json$b = [
      {
          'tfOpName': '_FusedMatMul',
          'category': 'matrices',
          'inputs': [
              { 'start': 0, 'name': 'a', 'type': 'tensor' },
              { 'start': 1, 'name': 'b', 'type': 'tensor' },
              { 'start': 2, end: 0, 'name': 'args', 'type': 'tensors' },
          ],
          'attrs': [
              { 'tfName': 'num_args', 'name': 'numArgs', 'type': 'number' }, {
                  'tfName': 'fused_ops',
                  'name': 'fusedOps',
                  'type': 'string[]',
                  'defaultValue': []
              },
              {
                  'tfName': 'epsilon',
                  'name': 'epsilon',
                  'type': 'number',
                  'defaultValue': 0.0001
              },
              {
                  'tfName': 'transpose_a',
                  'name': 'transposeA',
                  'type': 'bool',
                  'defaultValue': false
              },
              {
                  'tfName': 'transpose_b',
                  'name': 'transposeB',
                  'type': 'bool',
                  'defaultValue': false
              },
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'MatMul',
          'category': 'matrices',
          'inputs': [
              { 'start': 0, 'name': 'a', 'type': 'tensor' },
              { 'start': 1, 'name': 'b', 'type': 'tensor' },
          ],
          'attrs': [
              {
                  'tfName': 'transpose_a',
                  'name': 'transposeA',
                  'type': 'bool',
                  'defaultValue': false
              },
              {
                  'tfName': 'transpose_b',
                  'name': 'transposeB',
                  'type': 'bool',
                  'defaultValue': false
              },
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'BatchMatMul',
          'category': 'matrices',
          'inputs': [
              { 'start': 0, 'name': 'a', 'type': 'tensor' },
              { 'start': 1, 'name': 'b', 'type': 'tensor' },
          ],
          'attrs': [
              {
                  'tfName': 'adj_x',
                  'name': 'transposeA',
                  'type': 'bool',
                  'defaultValue': false
              },
              {
                  'tfName': 'adj_y',
                  'name': 'transposeB',
                  'type': 'bool',
                  'defaultValue': false
              },
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'BatchMatMulV2',
          'category': 'matrices',
          'inputs': [
              { 'start': 0, 'name': 'a', 'type': 'tensor' },
              { 'start': 1, 'name': 'b', 'type': 'tensor' },
          ],
          'attrs': [
              {
                  'tfName': 'adj_x',
                  'name': 'transposeA',
                  'type': 'bool',
                  'defaultValue': false
              },
              {
                  'tfName': 'adj_y',
                  'name': 'transposeB',
                  'type': 'bool',
                  'defaultValue': false
              },
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'Transpose',
          'category': 'matrices',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
              { 'start': 1, 'name': 'perm', 'type': 'number[]' },
          ],
          'attrs': [
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype', 'notSupported': true }
          ]
      },
      {
          'tfOpName': 'Einsum',
          'category': 'matrices',
          'inputs': [{ 'start': 0, 'end': 0, 'name': 'tensors', 'type': 'tensors' }],
          'attrs': [
              { 'tfName': 'equation', 'name': 'equation', 'type': 'string' },
              { 'tfName': 'N', 'name': 'n', 'type': 'number', 'defaultValue': 2 },
              { 'tfName': 'T', 'name': 'dtype', 'type': 'dtype' }
          ]
      }
  ];

  var matrices = /*#__PURE__*/Object.freeze({
    __proto__: null,
    json: json$b
  });

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
  const json$c = [
      {
          'tfOpName': 'FusedBatchNorm',
          'category': 'normalization',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
              { 'start': 1, 'name': 'scale', 'type': 'tensor' },
              { 'start': 2, 'name': 'offset', 'type': 'tensor' },
              { 'start': 3, 'name': 'mean', 'type': 'tensor' },
              { 'start': 4, 'name': 'variance', 'type': 'tensor' },
          ],
          'attrs': [
              {
                  'tfName': 'epsilon',
                  'name': 'epsilon',
                  'type': 'number',
                  'defaultValue': 0.001
              },
              {
                  'tfName': 'data_format',
                  'name': 'dataFormat',
                  'type': 'string',
                  'notSupported': true
              }
          ]
      },
      {
          'tfOpName': 'FusedBatchNormV2',
          'category': 'normalization',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
              { 'start': 1, 'name': 'scale', 'type': 'tensor' },
              { 'start': 2, 'name': 'offset', 'type': 'tensor' },
              { 'start': 3, 'name': 'mean', 'type': 'tensor' },
              { 'start': 4, 'name': 'variance', 'type': 'tensor' },
          ],
          'attrs': [
              {
                  'tfName': 'epsilon',
                  'name': 'epsilon',
                  'type': 'number',
                  'defaultValue': 0.001
              },
              {
                  'tfName': 'data_format',
                  'name': 'dataFormat',
                  'type': 'string',
                  'notSupported': true
              }
          ]
      },
      {
          'tfOpName': 'FusedBatchNormV3',
          'category': 'normalization',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
              { 'start': 1, 'name': 'scale', 'type': 'tensor' },
              { 'start': 2, 'name': 'offset', 'type': 'tensor' },
              { 'start': 3, 'name': 'mean', 'type': 'tensor' },
              { 'start': 4, 'name': 'variance', 'type': 'tensor' },
          ],
          'attrs': [
              {
                  'tfName': 'epsilon',
                  'name': 'epsilon',
                  'type': 'number',
                  'defaultValue': 0.001
              },
              {
                  'tfName': 'data_format',
                  'name': 'dataFormat',
                  'type': 'string',
                  'notSupported': true
              }
          ]
      },
      {
          'tfOpName': 'LRN',
          'category': 'normalization',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
          ],
          'attrs': [
              {
                  'tfName': 'depth_radius',
                  'name': 'radius',
                  'type': 'number',
                  'defaultValue': 5
              },
              { 'tfName': 'bias', 'name': 'bias', 'type': 'number', 'defaultValue': 1.0 },
              {
                  'tfName': 'alpha',
                  'name': 'alpha',
                  'type': 'number',
                  'defaultValue': 1.0
              },
              {
                  'tfName': 'beta',
                  'name': 'beta',
                  'type': 'number',
                  'defaultValue': 0.5
              }
          ]
      },
      {
          'tfOpName': 'Softmax',
          'category': 'normalization',
          'inputs': [{ 'start': 0, 'name': 'x', 'type': 'tensor' }]
      },
      {
          'tfOpName': 'LogSoftmax',
          'category': 'normalization',
          'inputs': [{ 'start': 0, 'name': 'x', 'type': 'tensor' }]
      },
      {
          'tfOpName': 'SparseToDense',
          'category': 'normalization',
          'inputs': [
              { 'start': 0, 'name': 'sparseIndices', 'type': 'tensor' },
              { 'start': 1, 'name': 'outputShape', 'type': 'number[]' },
              { 'start': 2, 'name': 'sparseValues', 'type': 'tensor' },
              { 'start': 3, 'name': 'defaultValue', 'type': 'tensor' },
          ],
          'attrs': [{
                  'tfName': 'validate_indices',
                  'name': 'validateIndices',
                  'type': 'bool',
                  'defaultValue': true,
                  'notSupported': true
              }]
      }
  ];

  var normalization = /*#__PURE__*/Object.freeze({
    __proto__: null,
    json: json$c
  });

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
  const json$d = [
      {
          'tfOpName': 'Bincount',
          'category': 'reduction',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
              { 'start': 1, 'name': 'size', 'type': 'number' },
              { 'start': 2, 'name': 'weights', 'type': 'tensor' }
          ]
      },
      {
          'tfOpName': 'DenseBincount',
          'category': 'reduction',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
              { 'start': 1, 'name': 'size', 'type': 'number' },
              { 'start': 2, 'name': 'weights', 'type': 'tensor' }
          ],
          'attrs': [{ 'tfName': 'binary_output', 'name': 'binaryOutput', 'type': 'bool' }]
      },
      {
          'tfOpName': 'Max',
          'category': 'reduction',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
              { 'start': 1, 'name': 'axis', 'type': 'number[]' },
          ],
          'attrs': [{ 'tfName': 'keep_dims', 'name': 'keepDims', 'type': 'bool' }]
      },
      {
          'tfOpName': 'Mean',
          'category': 'reduction',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
              { 'start': 1, 'name': 'axis', 'type': 'number[]' },
          ],
          'attrs': [{ 'tfName': 'keep_dims', 'name': 'keepDims', 'type': 'bool' }]
      },
      {
          'tfOpName': 'Min',
          'category': 'reduction',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
              { 'start': 1, 'name': 'axis', 'type': 'number[]' },
          ],
          'attrs': [{ 'tfName': 'keep_dims', 'name': 'keepDims', 'type': 'bool' }]
      },
      {
          'tfOpName': 'Sum',
          'category': 'reduction',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
              { 'start': 1, 'name': 'axis', 'type': 'number[]' },
          ],
          'attrs': [{ 'tfName': 'keep_dims', 'name': 'keepDims', 'type': 'bool' }]
      },
      {
          'tfOpName': 'All',
          'category': 'reduction',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
              { 'start': 1, 'name': 'axis', 'type': 'number[]' },
          ],
          'attrs': [{ 'tfName': 'keep_dims', 'name': 'keepDims', 'type': 'bool' }]
      },
      {
          'tfOpName': 'Any',
          'category': 'reduction',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
              { 'start': 1, 'name': 'axis', 'type': 'number[]' },
          ],
          'attrs': [{ 'tfName': 'keep_dims', 'name': 'keepDims', 'type': 'bool' }]
      },
      {
          'tfOpName': 'ArgMax',
          'category': 'reduction',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
              { 'start': 1, 'name': 'axis', 'type': 'number' }
          ]
      },
      {
          'tfOpName': 'ArgMin',
          'category': 'reduction',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
              { 'start': 1, 'name': 'axis', 'type': 'number' }
          ]
      },
      {
          'tfOpName': 'Prod',
          'category': 'reduction',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
              { 'start': 1, 'name': 'axis', 'type': 'number[]' },
          ],
          'attrs': [{ 'tfName': 'keep_dims', 'name': 'keepDims', 'type': 'bool' }]
      },
      {
          'tfOpName': 'Cumsum',
          'category': 'reduction',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
              { 'start': 1, 'name': 'axis', 'type': 'number' },
          ],
          'attrs': [
              { 'tfName': 'exclusive', 'name': 'exclusive', 'type': 'bool' },
              { 'tfName': 'reverse', 'name': 'reverse', 'type': 'bool' }
          ]
      }
  ];

  var reduction = /*#__PURE__*/Object.freeze({
    __proto__: null,
    json: json$d
  });

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
  const json$e = [
      {
          'tfOpName': 'ConcatV2',
          'category': 'slice_join',
          'inputs': [
              { 'start': 0, 'end': -1, 'name': 'tensors', 'type': 'tensors' },
              { 'start': -1, 'name': 'axis', 'type': 'number' }
          ],
          'attrs': [{ 'tfName': 'N', 'name': 'n', 'type': 'number', 'defaultValue': 2 }]
      },
      {
          'tfOpName': 'Concat',
          'category': 'slice_join',
          'inputs': [
              { 'start': 1, 'end': 0, 'name': 'tensors', 'type': 'tensors' },
              { 'start': 0, 'name': 'axis', 'type': 'number' }
          ],
          'attrs': [{ 'tfName': 'N', 'name': 'n', 'type': 'number', 'defaultValue': 2 }]
      },
      {
          'tfOpName': 'GatherV2',
          'category': 'slice_join',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
              { 'start': 1, 'name': 'indices', 'type': 'tensor' },
              { 'start': 2, 'name': 'axis', 'type': 'number', 'defaultValue': 0 }
          ],
          'attrs': [{
                  'tfName': 'batch_dims',
                  'name': 'batchDims',
                  'type': 'number',
                  'defaultValue': 0
              }]
      },
      {
          'tfOpName': 'Gather',
          'category': 'slice_join',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
              { 'start': 1, 'name': 'indices', 'type': 'tensor' },
          ],
          'attrs': [{
                  'tfName': 'validate_indices',
                  'name': 'validateIndices',
                  'type': 'bool',
                  'notSupported': true
              }]
      },
      {
          'tfOpName': 'Reverse',
          'category': 'slice_join',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
              { 'start': 1, 'name': 'dims', 'type': 'bool[]' }
          ]
      },
      {
          'tfOpName': 'ReverseV2',
          'category': 'slice_join',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
              { 'start': 1, 'name': 'axis', 'type': 'number[]' }
          ]
      },
      {
          'tfOpName': 'Slice',
          'category': 'slice_join',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
              { 'start': 1, 'name': 'begin', 'type': 'number[]' },
              { 'start': 2, 'name': 'size', 'type': 'number[]' }
          ]
      },
      {
          'tfOpName': 'StridedSlice',
          'category': 'slice_join',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
              { 'start': 1, 'name': 'begin', 'type': 'number[]' },
              { 'start': 2, 'name': 'end', 'type': 'number[]' },
              { 'start': 3, 'name': 'strides', 'type': 'number[]' },
          ],
          'attrs': [
              {
                  'tfName': 'begin_mask',
                  'name': 'beginMask',
                  'type': 'number',
                  'defaultValue': 0
              },
              {
                  'tfName': 'end_mask',
                  'name': 'endMask',
                  'type': 'number',
                  'defaultValue': 0
              },
              {
                  'tfName': 'new_axis_mask',
                  'name': 'newAxisMask',
                  'type': 'number',
                  'defaultValue': 0
              },
              {
                  'tfName': 'ellipsis_mask',
                  'name': 'ellipsisMask',
                  'type': 'number',
                  'defaultValue': 0
              },
              {
                  'tfName': 'shrink_axis_mask',
                  'name': 'shrinkAxisMask',
                  'type': 'number',
                  'defaultValue': 0
              }
          ]
      },
      {
          'tfOpName': 'Pack',
          'category': 'slice_join',
          'inputs': [
              { 'start': 0, 'end': 0, 'name': 'tensors', 'type': 'tensors' },
          ],
          'attrs': [
              { 'tfName': 'axis', 'name': 'axis', 'type': 'number', 'defaultValue': 0 }
          ]
      },
      {
          'tfOpName': 'Unpack',
          'category': 'slice_join',
          'inputs': [
              { 'start': 0, 'name': 'tensor', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'axis', 'name': 'axis', 'type': 'number', 'defaultValue': 0 }, {
                  'tfName': 'num',
                  'name': 'num',
                  'type': 'number',
                  'defaultValue': 0,
                  'notSupported': true
              }
          ]
      },
      {
          'tfOpName': 'Tile',
          'category': 'slice_join',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
              { 'start': 1, 'name': 'reps', 'type': 'number[]' }
          ]
      },
      {
          'tfOpName': 'Split',
          'category': 'slice_join',
          'inputs': [
              { 'start': 0, 'name': 'axis', 'type': 'number', 'defaultValue': 0 },
              { 'start': 1, 'name': 'x', 'type': 'tensor' },
          ],
          'attrs': [{
                  'tfName': 'num_split',
                  'name': 'numOrSizeSplits',
                  'type': 'number',
                  'defaultValue': 1
              }]
      },
      {
          'tfOpName': 'SplitV',
          'category': 'slice_join',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
              { 'start': 1, 'name': 'numOrSizeSplits', 'type': 'number[]' },
              { 'start': 2, 'name': 'axis', 'type': 'number', 'defaultValue': 0 }
          ]
      },
      {
          'tfOpName': 'ScatterNd',
          'category': 'slice_join',
          'inputs': [
              { 'start': 0, 'name': 'indices', 'type': 'tensor' },
              { 'start': 1, 'name': 'values', 'type': 'tensor' },
              { 'start': 2, 'name': 'shape', 'type': 'number[]' }
          ]
      },
      {
          'tfOpName': 'GatherNd',
          'category': 'slice_join',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
              { 'start': 1, 'name': 'indices', 'type': 'tensor' }
          ]
      },
      {
          'tfOpName': 'SparseToDense',
          'category': 'slice_join',
          'inputs': [
              { 'start': 0, 'name': 'sparseIndices', 'type': 'tensor' },
              { 'start': 1, 'name': 'outputShape', 'type': 'number[]' },
              { 'start': 2, 'name': 'sparseValues', 'type': 'tensor' },
              { 'start': 3, 'name': 'defaultValue', 'type': 'tensor' },
          ],
          'attrs': [{
                  'tfName': 'validate_indices',
                  'name': 'validateIndices',
                  'type': 'bool',
                  'defaultValue': false,
                  'notSupported': true
              }]
      }
  ];

  var sliceJoin = /*#__PURE__*/Object.freeze({
    __proto__: null,
    json: json$e
  });

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
  const json$f = [
      {
          'tfOpName': 'FFT',
          'category': 'spectral',
          'inputs': [{ 'start': 0, 'name': 'x', 'type': 'tensor' }]
      },
      {
          'tfOpName': 'IFFT',
          'category': 'spectral',
          'inputs': [{ 'start': 0, 'name': 'x', 'type': 'tensor' }]
      },
      {
          'tfOpName': 'RFFT',
          'category': 'spectral',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' }, {
                  'start': 1,
                  'name': 'fft_length',
                  'type': 'number',
                  'notSupported': true
              }
          ]
      },
      {
          'tfOpName': 'IRFFT',
          'category': 'spectral',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' }, {
                  'start': 1,
                  'name': 'fft_length',
                  'type': 'number',
                  'notSupported': true
              }
          ]
      }
  ];

  var spectral = /*#__PURE__*/Object.freeze({
    __proto__: null,
    json: json$f
  });

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
  const json$g = [
      {
          'tfOpName': 'Cast',
          'category': 'transformation',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
          ],
          'attrs': [
              {
                  'tfName': 'SrcT',
                  'name': 'sdtype',
                  'type': 'dtype',
                  'notSupported': true
              },
              { 'tfName': 'DstT', 'name': 'dtype', 'type': 'dtype' }
          ]
      },
      {
          'tfOpName': 'ExpandDims',
          'category': 'transformation',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
              { 'start': 1, 'name': 'axis', 'type': 'number' }
          ]
      },
      {
          'tfOpName': 'MirrorPad',
          'category': 'transformation',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
              { 'start': 1, 'name': 'padding', 'type': 'number[]' },
          ],
          'attrs': [{ 'tfName': 'mode', 'name': 'mode', 'type': 'string' }]
      },
      {
          'tfOpName': 'Pad',
          'category': 'transformation',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
              { 'start': 1, 'name': 'padding', 'type': 'number[]' },
          ],
          'attrs': [{
                  'tfName': 'constant_value',
                  'name': 'constantValue',
                  'type': 'number',
                  'defaultValue': 0
              }]
      },
      {
          'tfOpName': 'PadV2',
          'category': 'transformation',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
              { 'start': 1, 'name': 'padding', 'type': 'number[]' }, {
                  'start': 2,
                  'name': 'constantValue',
                  'type': 'number',
                  'defaultValue': 0
              }
          ]
      },
      {
          'tfOpName': 'Reshape',
          'category': 'transformation',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
              { 'start': 1, 'name': 'shape', 'type': 'number[]' }
          ]
      },
      {
          'tfOpName': 'Squeeze',
          'category': 'transformation',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
          ],
          'attrs': [{
                  'tfName': 'axis',
                  'tfDeprecatedName': 'squeeze_dims',
                  'name': 'axis',
                  'type': 'number[]'
              }]
      },
      {
          'tfOpName': 'SpaceToBatchND',
          'category': 'transformation',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
              { 'start': 1, 'name': 'blockShape', 'type': 'number[]' },
              { 'start': 2, 'name': 'paddings', 'type': 'number[]' }
          ]
      },
      {
          'tfOpName': 'BatchToSpaceND',
          'category': 'transformation',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
              { 'start': 1, 'name': 'blockShape', 'type': 'number[]' },
              { 'start': 2, 'name': 'crops', 'type': 'number[]' }
          ]
      },
      {
          'tfOpName': 'DepthToSpace',
          'category': 'transformation',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
          ],
          'attrs': [
              { 'tfName': 'block_size', 'name': 'blockSize', 'type': 'number' },
              { 'tfName': 'data_format', 'name': 'dataFormat', 'type': 'string' }
          ]
      },
      {
          'tfOpName': 'BroadcastTo',
          'category': 'transformation',
          'inputs': [
              { 'start': 0, 'name': 'x', 'type': 'tensor' },
              { 'start': 1, 'name': 'shape', 'type': 'number[]' },
          ],
          'attrs': []
      }
  ];

  var transformation = /*#__PURE__*/Object.freeze({
    __proto__: null,
    json: json$g
  });

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
  class OperationMapper {
      // Singleton instance for the mapper
      static get Instance() {
          return this._instance || (this._instance = new this());
      }
      // Loads the op mapping from the JSON file.
      constructor() {
          const ops = [
              arithmetic, basicMath, control, convolution, creation, dynamic,
              evaluation, logical, image, graph, matrices, normalization, reduction,
              sliceJoin, spectral, transformation, hashTable
          ];
          const mappersJson = [].concat(...ops.map(op => op.json));
          this.opMappers = mappersJson.reduce((map, mapper) => {
              map[mapper.tfOpName] = mapper;
              return map;
          }, {});
      }
      // Converts the model inference graph from Tensorflow GraphDef to local
      // representation for TensorFlow.js API
      transformGraph(graph, signature = {}) {
          const tfNodes = graph.node;
          const placeholders = [];
          const weights = [];
          const initNodes = [];
          const nodes = tfNodes.reduce((map, node) => {
              map[node.name] = this.mapNode(node);
              if (node.op.startsWith('Placeholder')) {
                  placeholders.push(map[node.name]);
              }
              else if (node.op === 'Const') {
                  weights.push(map[node.name]);
              }
              else if (node.input == null || node.input.length === 0) {
                  initNodes.push(map[node.name]);
              }
              return map;
          }, {});
          let inputs = [];
          const outputs = [];
          let inputNodeNameToKey = {};
          let outputNodeNameToKey = {};
          if (signature != null) {
              inputNodeNameToKey = this.mapSignatureEntries(signature.inputs);
              outputNodeNameToKey = this.mapSignatureEntries(signature.outputs);
          }
          const allNodes = Object.keys(nodes);
          allNodes.forEach(key => {
              const node = nodes[key];
              node.inputNames.forEach(name => {
                  const [nodeName,] = getNodeNameAndIndex(name);
                  node.inputs.push(nodes[nodeName]);
                  nodes[nodeName].children.push(node);
              });
          });
          // if signature has not outputs set, add any node that does not have
          // outputs.
          if (Object.keys(outputNodeNameToKey).length === 0) {
              allNodes.forEach(key => {
                  const node = nodes[key];
                  if (node.children.length === 0) {
                      outputs.push(node);
                  }
              });
          }
          else {
              Object.keys(outputNodeNameToKey).forEach(name => {
                  const [nodeName,] = getNodeNameAndIndex(name);
                  const node = nodes[nodeName];
                  if (node != null) {
                      node.signatureKey = outputNodeNameToKey[name];
                      outputs.push(node);
                  }
              });
          }
          if (Object.keys(inputNodeNameToKey).length > 0) {
              Object.keys(inputNodeNameToKey).forEach(name => {
                  const [nodeName,] = getNodeNameAndIndex(name);
                  const node = nodes[nodeName];
                  if (node) {
                      node.signatureKey = inputNodeNameToKey[name];
                      inputs.push(node);
                  }
              });
          }
          else {
              inputs = placeholders;
          }
          let functions = {};
          if (graph.library != null && graph.library.function != null) {
              functions = graph.library.function.reduce((functions, func) => {
                  functions[func.signature.name] = this.mapFunction(func);
                  return functions;
              }, {});
          }
          const result = { nodes, inputs, outputs, weights, placeholders, signature, functions };
          if (initNodes.length > 0) {
              result.initNodes = initNodes;
          }
          return result;
      }
      mapSignatureEntries(entries) {
          return Object.keys(entries || {})
              .reduce((prev, curr) => {
              prev[entries[curr].name] = curr;
              return prev;
          }, {});
      }
      mapNode(node) {
          // Unsupported ops will cause an error at run-time (not parse time), since
          // they may not be used by the actual execution subgraph.
          const mapper = getRegisteredOp(node.op) || this.opMappers[node.op] || {};
          if (node.attr == null) {
              node.attr = {};
          }
          const newNode = {
              name: node.name,
              op: node.op,
              category: mapper.category,
              inputNames: (node.input ||
                  []).map(input => input.startsWith('^') ? input.substr(1) : input),
              inputs: [],
              children: [],
              inputParams: {},
              attrParams: {},
              rawAttrs: node.attr
          };
          if (mapper.inputs != null) {
              newNode.inputParams =
                  mapper.inputs.reduce((map, param) => {
                      map[param.name] = {
                          type: param.type,
                          inputIndexStart: param.start,
                          inputIndexEnd: param.end
                      };
                      return map;
                  }, {});
          }
          if (mapper.attrs != null) {
              newNode.attrParams =
                  mapper.attrs.reduce((map, param) => {
                      const type = param.type;
                      let value = undefined;
                      switch (param.type) {
                          case 'string':
                              value = getStringParam(node.attr, param.tfName, param.defaultValue);
                              if (value === undefined && !!param.tfDeprecatedName) {
                                  value = getStringParam(node.attr, param.tfDeprecatedName, param.defaultValue);
                              }
                              break;
                          case 'string[]':
                              value = getStringArrayParam(node.attr, param.tfName, param.defaultValue);
                              if (value === undefined && !!param.tfDeprecatedName) {
                                  value = getStringArrayParam(node.attr, param.tfDeprecatedName, param.defaultValue);
                              }
                              break;
                          case 'number':
                              value = getNumberParam(node.attr, param.tfName, (param.defaultValue || 0));
                              if (value === undefined && !!param.tfDeprecatedName) {
                                  value = getNumberParam(node.attr, param.tfDeprecatedName, param.defaultValue);
                              }
                              break;
                          case 'number[]':
                              value = getNumericArrayParam(node.attr, param.tfName, param.defaultValue);
                              if (value === undefined && !!param.tfDeprecatedName) {
                                  value = getNumericArrayParam(node.attr, param.tfDeprecatedName, param.defaultValue);
                              }
                              break;
                          case 'bool':
                              value = getBoolParam(node.attr, param.tfName, param.defaultValue);
                              if (value === undefined && !!param.tfDeprecatedName) {
                                  value = getBoolParam(node.attr, param.tfDeprecatedName, param.defaultValue);
                              }
                              break;
                          case 'bool[]':
                              value = getBoolArrayParam(node.attr, param.tfName, param.defaultValue);
                              if (value === undefined && !!param.tfDeprecatedName) {
                                  value = getBoolArrayParam(node.attr, param.tfDeprecatedName, param.defaultValue);
                              }
                              break;
                          case 'shape':
                              value = getTensorShapeParam(node.attr, param.tfName, param.defaultValue);
                              if (value === undefined && !!param.tfDeprecatedName) {
                                  value = getTensorShapeParam(node.attr, param.tfDeprecatedName, param.defaultValue);
                              }
                              break;
                          case 'shape[]':
                              value = getTensorShapeArrayParam(node.attr, param.tfName, param.defaultValue);
                              if (value === undefined && !!param.tfDeprecatedName) {
                                  value = getTensorShapeArrayParam(node.attr, param.tfDeprecatedName, param.defaultValue);
                              }
                              break;
                          case 'dtype':
                              value = getDtypeParam(node.attr, param.tfName, param.defaultValue);
                              if (value === undefined && !!param.tfDeprecatedName) {
                                  value = getDtypeParam(node.attr, param.tfDeprecatedName, param.defaultValue);
                              }
                              break;
                          case 'dtype[]':
                              value = getDtypeArrayParam(node.attr, param.tfName, param.defaultValue);
                              if (value === undefined && !!param.tfDeprecatedName) {
                                  value = getDtypeArrayParam(node.attr, param.tfDeprecatedName, param.defaultValue);
                              }
                              break;
                          case 'func':
                              value = getFuncParam(node.attr, param.tfName, param.defaultValue);
                              if (value === undefined && !!param.tfDeprecatedName) {
                                  value = getFuncParam(node.attr, param.tfDeprecatedName, param.defaultValue);
                              }
                              break;
                          case 'tensor':
                          case 'tensors':
                              break;
                          default:
                              throw new Error(`Unsupported param type: ${param.type} for op: ${node.op}`);
                      }
                      map[param.name] = { value, type };
                      return map;
                  }, {});
          }
          return newNode;
      }
      // map the TFunctionDef to TFJS graph object
      mapFunction(functionDef) {
          const tfNodes = functionDef.nodeDef;
          const placeholders = [];
          const weights = [];
          let nodes = {};
          if (tfNodes != null) {
              nodes = tfNodes.reduce((map, node) => {
                  map[node.name] = this.mapNode(node);
                  if (node.op === 'Const') {
                      weights.push(map[node.name]);
                  }
                  return map;
              }, {});
          }
          const inputs = [];
          const outputs = [];
          functionDef.signature.inputArg.forEach(arg => {
              const [nodeName,] = getNodeNameAndIndex(arg.name);
              const node = {
                  name: nodeName,
                  op: 'Placeholder',
                  inputs: [],
                  inputNames: [],
                  category: 'graph',
                  inputParams: {},
                  attrParams: { dtype: { value: parseDtypeParam(arg.type), type: 'dtype' } },
                  children: []
              };
              node.signatureKey = arg.name;
              inputs.push(node);
              nodes[nodeName] = node;
          });
          const allNodes = Object.keys(nodes);
          allNodes.forEach(key => {
              const node = nodes[key];
              node.inputNames.forEach(name => {
                  const [nodeName,] = getNodeNameAndIndex(name);
                  node.inputs.push(nodes[nodeName]);
                  nodes[nodeName].children.push(node);
              });
          });
          const returnNodeMap = functionDef.ret;
          functionDef.signature.outputArg.forEach(output => {
              const [nodeName, index] = getNodeNameAndIndex(returnNodeMap[output.name]);
              const node = nodes[nodeName];
              if (node != null) {
                  node.defaultOutput = index;
                  outputs.push(node);
              }
          });
          const signature = this.mapArgsToSignature(functionDef);
          return { nodes, inputs, outputs, weights, placeholders, signature };
      }
      mapArgsToSignature(functionDef) {
          return {
              methodName: functionDef.signature.name,
              inputs: functionDef.signature.inputArg.reduce((map, arg) => {
                  map[arg.name] = this.mapArgToTensorInfo(arg);
                  return map;
              }, {}),
              outputs: functionDef.signature.outputArg.reduce((map, arg) => {
                  map[arg.name] = this.mapArgToTensorInfo(arg, functionDef.ret);
                  return map;
              }, {}),
          };
      }
      mapArgToTensorInfo(arg, nameMap) {
          let name = arg.name;
          if (nameMap != null) {
              name = nameMap[name];
          }
          return { name, dtype: arg.type };
      }
  }
  function decodeBase64(text) {
      const global = tfc.env().global;
      if (typeof global.atob !== 'undefined') {
          return global.atob(text);
      }
      else if (typeof Buffer !== 'undefined') {
          return new Buffer(text, 'base64').toString();
      }
      else {
          throw new Error('Unable to decode base64 in this environment. ' +
              'Missing built-in atob() or Buffer()');
      }
  }
  function parseStringParam(s, keepCase) {
      const value = Array.isArray(s) ? String.fromCharCode.apply(null, s) : decodeBase64(s);
      return keepCase ? value : value.toLowerCase();
  }
  function getStringParam(attrs, name, def, keepCase = false) {
      const param = attrs[name];
      if (param != null) {
          return parseStringParam(param.s, keepCase);
      }
      return def;
  }
  function getBoolParam(attrs, name, def) {
      const param = attrs[name];
      return param ? param.b : def;
  }
  function getNumberParam(attrs, name, def) {
      const param = attrs[name] || {};
      const value = param['i'] != null ? param['i'] : (param['f'] != null ? param['f'] : def);
      return (typeof value === 'number') ? value : parseInt(value, 10);
  }
  function parseDtypeParam(value) {
      if (typeof (value) === 'string') {
          // tslint:disable-next-line:no-any
          value = DataType[value];
      }
      switch (value) {
          case DataType.DT_FLOAT:
              return 'float32';
          case DataType.DT_INT32:
          case DataType.DT_INT64:
          case DataType.DT_INT8:
          case DataType.DT_UINT8:
              return 'int32';
          case DataType.DT_BOOL:
              return 'bool';
          case DataType.DT_DOUBLE:
              return 'float32';
          case DataType.DT_STRING:
              return 'string';
          default:
              // Unknown dtype error will happen at runtime (instead of parse time),
              // since these nodes might not be used by the actual subgraph execution.
              return null;
      }
  }
  function getFuncParam(attrs, name, def) {
      const param = attrs[name];
      if (param && param.func) {
          return param.func.name;
      }
      return def;
  }
  function getDtypeParam(attrs, name, def) {
      const param = attrs[name];
      if (param && param.type) {
          return parseDtypeParam(param.type);
      }
      return def;
  }
  function getDtypeArrayParam(attrs, name, def) {
      const param = attrs[name];
      if (param && param.list && param.list.type) {
          return param.list.type.map(v => parseDtypeParam(v));
      }
      return def;
  }
  function parseTensorShapeParam(shape) {
      if (shape.unknownRank) {
          return undefined;
      }
      if (shape.dim != null) {
          return shape.dim.map(dim => (typeof dim.size === 'number') ? dim.size : parseInt(dim.size, 10));
      }
      return [];
  }
  function getTensorShapeParam(attrs, name, def) {
      const param = attrs[name];
      if (param && param.shape) {
          return parseTensorShapeParam(param.shape);
      }
      return def;
  }
  function getNumericArrayParam(attrs, name, def) {
      const param = attrs[name];
      if (param) {
          return ((param.list.f && param.list.f.length ? param.list.f :
              param.list.i) ||
              [])
              .map(v => (typeof v === 'number') ? v : parseInt(v, 10));
      }
      return def;
  }
  function getStringArrayParam(attrs, name, def, keepCase = false) {
      const param = attrs[name];
      if (param && param.list && param.list.s) {
          return param.list.s.map((v) => {
              return parseStringParam(v, keepCase);
          });
      }
      return def;
  }
  function getTensorShapeArrayParam(attrs, name, def) {
      const param = attrs[name];
      if (param && param.list && param.list.shape) {
          return param.list.shape.map((v) => {
              return parseTensorShapeParam(v);
          });
      }
      return def;
  }
  function getBoolArrayParam(attrs, name, def) {
      const param = attrs[name];
      if (param && param.list && param.list.b) {
          return param.list.b;
      }
      return def;
  }

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
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
  /**
   * Helper class for lookup inputs and params for nodes in the model graph.
   */
  class NodeValueImpl {
      constructor(node, tensorMap, context) {
          this.node = node;
          this.tensorMap = tensorMap;
          this.context = context;
          this.inputs = [];
          this.attrs = {};
          this.inputs = node.inputNames.map(name => this.getInput(name));
          if (node.rawAttrs != null) {
              this.attrs = Object.keys(node.rawAttrs)
                  .reduce((attrs, key) => {
                  attrs[key] = this.getAttr(key);
                  return attrs;
              }, {});
          }
      }
      /**
       * Return the value of the attribute or input param.
       * @param name String: name of attribute or input param.
       */
      getInput(name) {
          return getTensor(name, this.tensorMap, this.context);
      }
      /**
       * Return the value of the attribute or input param.
       * @param name String: name of attribute or input param.
       */
      getAttr(name, defaultValue) {
          const value = this.node.rawAttrs[name];
          if (value.tensor != null) {
              return getTensor(name, this.tensorMap, this.context);
          }
          if (value.i != null || value.f != null) {
              return getNumberParam(this.node.rawAttrs, name, defaultValue);
          }
          if (value.s != null) {
              return getStringParam(this.node.rawAttrs, name, defaultValue);
          }
          if (value.b != null) {
              return getBoolParam(this.node.rawAttrs, name, defaultValue);
          }
          if (value.shape != null) {
              return getTensorShapeParam(this.node.rawAttrs, name, defaultValue);
          }
          if (value.type != null) {
              return getDtypeParam(this.node.rawAttrs, name, defaultValue);
          }
          if (value.list != null) {
              if (value.list.i != null || value.list.f != null) {
                  return getNumericArrayParam(this.node.rawAttrs, name, defaultValue);
              }
              if (value.list.s != null) {
                  return getStringArrayParam(this.node.rawAttrs, name, defaultValue);
              }
              if (value.list.shape != null) {
                  return getTensorShapeArrayParam(this.node.rawAttrs, name, defaultValue);
              }
              if (value.list.b != null) {
                  return getBoolArrayParam(this.node.rawAttrs, name, defaultValue);
              }
              if (value.list.type != null) {
                  return getDtypeArrayParam(this.node.rawAttrs, name, defaultValue);
              }
          }
          return defaultValue;
      }
  }

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
  const executeOp = (node, tensorMap, context) => {
      switch (node.op) {
          case 'BiasAdd':
          case 'AddV2':
          case 'Add': {
              return [tfOps.add(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
          }
          case 'AddN': {
              return [tfOps.addN(getParamValue('tensors', node, tensorMap, context))];
          }
          case 'FloorMod':
          case 'Mod':
              return [tfOps.mod(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
          case 'Mul':
              return [tfOps.mul(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
          case 'RealDiv':
          case 'Div': {
              return [tfOps.div(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
          }
          case 'DivNoNan': {
              return [tfOps.divNoNan(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
          }
          case 'FloorDiv': {
              return [tfOps.floorDiv(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
          }
          case 'Sub': {
              return [tfOps.sub(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
          }
          case 'Minimum': {
              return [tfOps.minimum(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
          }
          case 'Maximum': {
              return [tfOps.maximum(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
          }
          case 'Pow': {
              return [tfOps.pow(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
          }
          case 'SquaredDifference': {
              return [tfOps.squaredDifference(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
          }
          default:
              throw TypeError(`Node type ${node.op} is not implemented`);
      }
  };

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
  const executeOp$1 = (node, tensorMap, context) => {
      switch (node.op) {
          case 'Abs':
          case 'ComplexAbs':
              return [tfOps.abs(getParamValue('x', node, tensorMap, context))];
          case 'Acos':
              return [tfOps.acos(getParamValue('x', node, tensorMap, context))];
          case 'Acosh':
              return [tfOps.acosh(getParamValue('x', node, tensorMap, context))];
          case 'Asin':
              return [tfOps.asin(getParamValue('x', node, tensorMap, context))];
          case 'Asinh':
              return [tfOps.asinh(getParamValue('x', node, tensorMap, context))];
          case 'Atan':
              return [tfOps.atan(getParamValue('x', node, tensorMap, context))];
          case 'Atan2':
              return [tfOps.atan2(getParamValue('x', node, tensorMap, context), getParamValue('y', node, tensorMap, context))];
          case 'Atanh':
              return [tfOps.atanh(getParamValue('x', node, tensorMap, context))];
          case 'Ceil':
              return [tfOps.ceil(getParamValue('x', node, tensorMap, context))];
          case 'Complex':
              return [tfOps.complex(getParamValue('real', node, tensorMap, context), getParamValue('imag', node, tensorMap, context))];
          case 'Cos':
              return [tfOps.cos(getParamValue('x', node, tensorMap, context))];
          case 'Cosh':
              return [tfOps.cosh(getParamValue('x', node, tensorMap, context))];
          case 'Elu':
              return [tfOps.elu(getParamValue('x', node, tensorMap, context))];
          case 'Erf':
              return [tfOps.erf(getParamValue('x', node, tensorMap, context))];
          case 'Exp':
              return [tfOps.exp(getParamValue('x', node, tensorMap, context))];
          case 'Expm1': {
              return [tfOps.expm1(getParamValue('x', node, tensorMap, context))];
          }
          case 'Floor':
              return [tfOps.floor(getParamValue('x', node, tensorMap, context))];
          case 'Log':
              return [tfOps.log(getParamValue('x', node, tensorMap, context))];
          case 'Log1p': {
              return [tfOps.log1p(getParamValue('x', node, tensorMap, context))];
          }
          case 'Imag':
              return [tfOps.imag(getParamValue('x', node, tensorMap, context))];
          case 'Neg':
              return [tfOps.neg(getParamValue('x', node, tensorMap, context))];
          case 'Reciprocal': {
              return [tfOps.reciprocal(getParamValue('x', node, tensorMap, context))];
          }
          case 'Real':
              return [tfOps.real(getParamValue('x', node, tensorMap, context))];
          case 'Relu':
              return [tfOps.relu(getParamValue('x', node, tensorMap, context))];
          case 'Round': {
              return [tfOps.round(getParamValue('x', node, tensorMap, context))];
          }
          case 'Selu':
              return [tfOps.selu(getParamValue('x', node, tensorMap, context))];
          case 'Sigmoid':
              return [tfOps.sigmoid(getParamValue('x', node, tensorMap, context))];
          case 'Sin':
              return [tfOps.sin(getParamValue('x', node, tensorMap, context))];
          case 'Sign': {
              return [tfOps.sign(getParamValue('x', node, tensorMap, context))];
          }
          case 'Sinh': {
              return [tfOps.sinh(getParamValue('x', node, tensorMap, context))];
          }
          case 'Softplus': {
              return [tfOps.softplus(getParamValue('x', node, tensorMap, context))];
          }
          case 'Sqrt': {
              return [tfOps.sqrt(getParamValue('x', node, tensorMap, context))];
          }
          case 'Square': {
              return [tfOps.square(getParamValue('x', node, tensorMap, context))];
          }
          case 'Tanh': {
              return [tfOps.tanh(getParamValue('x', node, tensorMap, context))];
          }
          case 'Tan':
              return [tfOps.tan(getParamValue('x', node, tensorMap, context))];
          case 'ClipByValue':
              return [tfOps.clipByValue(getParamValue('x', node, tensorMap, context), getParamValue('clipValueMin', node, tensorMap, context), getParamValue('clipValueMax', node, tensorMap, context))];
          case 'Relu6':
              return [tfOps.relu6(getParamValue('x', node, tensorMap, context))];
          case 'Rsqrt':
              return [tfOps.rsqrt(getTensor(node.inputNames[0], tensorMap, context))];
          case 'Prod':
              return [tfOps.prod(getParamValue('x', node, tensorMap, context), getParamValue('axes', node, tensorMap, context))];
          case 'LeakyRelu':
              return [tfOps.leakyRelu(getParamValue('x', node, tensorMap, context), getParamValue('alpha', node, tensorMap, context))];
          case 'Prelu':
              return [tfOps.prelu(getParamValue('x', node, tensorMap, context), getParamValue('alpha', node, tensorMap, context))];
          case 'IsNan':
              return [tfOps.isNaN(getTensor(node.inputNames[0], tensorMap, context))];
          default:
              throw TypeError(`Node type ${node.op} is not implemented`);
      }
  };

  /**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
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
  /**
   * Used by TensorList and TensorArray to verify if elementShape matches, support
   * negative value as the dim shape.
   * @param shapeA
   * @param shapeB
   * @param errorMessagePrefix
   */
  function assertShapesMatchAllowUndefinedSize(shapeA, shapeB, errorMessagePrefix = '') {
      // constant shape means unknown rank
      if (typeof shapeA === 'number' || typeof shapeB === 'number') {
          return;
      }
      tfc.util.assert(shapeA.length === shapeB.length, () => errorMessagePrefix + ` Shapes ${shapeA} and ${shapeB} must match`);
      for (let i = 0; i < shapeA.length; i++) {
          const dim0 = shapeA[i];
          const dim1 = shapeB[i];
          tfc.util.assert(dim0 < 0 || dim1 < 0 || dim0 === dim1, () => errorMessagePrefix + ` Shapes ${shapeA} and ${shapeB} must match`);
      }
  }
  function fullDefinedShape(elementShape) {
      if (typeof elementShape === 'number' || elementShape.some(dim => dim < 0)) {
          return false;
      }
      return true;
  }
  /**
   * Generate the output element shape from the list elementShape, list tensors
   * and input param.
   * @param listElementShape
   * @param tensors
   * @param elementShape
   */
  function inferElementShape(listElementShape, tensors, elementShape) {
      let partialShape = mergeElementShape(listElementShape, elementShape);
      const notfullDefinedShape = !fullDefinedShape(partialShape);
      if (notfullDefinedShape && tensors.length === 0) {
          throw new Error(`Tried to calculate elements of an empty list` +
              ` with non-fully-defined elementShape: ${partialShape}`);
      }
      if (notfullDefinedShape) {
          tensors.forEach(tensor => {
              partialShape = mergeElementShape(tensor.shape, partialShape);
          });
      }
      if (!fullDefinedShape(partialShape)) {
          throw new Error(`Non-fully-defined elementShape: ${partialShape}`);
      }
      return partialShape;
  }
  function mergeElementShape(elementShapeA, elementShapeB) {
      if (typeof elementShapeA === 'number') {
          return elementShapeB;
      }
      if (typeof elementShapeB === 'number') {
          return elementShapeA;
      }
      if (elementShapeA.length !== elementShapeB.length) {
          throw new Error(`Incompatible ranks during merge: ${elementShapeA} vs. ${elementShapeB}`);
      }
      const result = [];
      for (let i = 0; i < elementShapeA.length; ++i) {
          const dim0 = elementShapeA[i];
          const dim1 = elementShapeB[i];
          if (dim0 >= 0 && dim1 >= 0 && dim0 !== dim1) {
              throw new Error(`Incompatible shape during merge: ${elementShapeA} vs. ${elementShapeB}`);
          }
          result[i] = dim0 >= 0 ? dim0 : dim1;
      }
      return result;
  }

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
  /**
   * The TensorArray object keeps an array of Tensors.  It
   * allows reading from the array and writing to the array.
   */
  class TensorArray {
      constructor(name, dtype, maxSize, elementShape, identicalElementShapes, dynamicSize, clearAfterRead) {
          this.name = name;
          this.dtype = dtype;
          this.maxSize = maxSize;
          this.elementShape = elementShape;
          this.identicalElementShapes = identicalElementShapes;
          this.dynamicSize = dynamicSize;
          this.clearAfterRead = clearAfterRead;
          this.tensors = [];
          this.closed_ = false;
          this.idTensor = tfc.scalar(0);
          tfc.keep(this.idTensor);
      }
      get id() {
          return this.idTensor.id;
      }
      get closed() {
          return this.closed_;
      }
      /**
       * Dispose the tensors and idTensor and mark the TensoryArray as closed.
       */
      clearAndClose(keepIds) {
          this.tensors.forEach(tensor => {
              if (keepIds == null || !keepIds.has(tensor.tensor.id)) {
                  tensor.tensor.dispose();
              }
          });
          this.tensors = [];
          this.closed_ = true;
          this.idTensor.dispose();
      }
      size() {
          return this.tensors.length;
      }
      /**
       * Read the value at location index in the TensorArray.
       * @param index Number the index to read from.
       */
      read(index) {
          if (this.closed_) {
              throw new Error(`TensorArray ${this.name} has already been closed.`);
          }
          if (index < 0 || index >= this.size()) {
              throw new Error(`Tried to read from index ${index}, but array size is: ${this.size()}`);
          }
          const tensorWithState = this.tensors[index];
          if (tensorWithState.cleared) {
              throw new Error(`TensorArray ${this.name}: Could not read index ${index} twice because it was cleared after a previous read ` +
                  `(perhaps try setting clear_after_read = false?).`);
          }
          if (this.clearAfterRead) {
              tensorWithState.cleared = true;
          }
          tensorWithState.read = true;
          return tensorWithState.tensor;
      }
      /**
       * Helper method to read multiple tensors from the specified indices.
       */
      readMany(indices) {
          return indices.map(index => this.read(index));
      }
      /**
       * Write value into the index of the TensorArray.
       * @param index number the index to write to.
       * @param tensor
       */
      write(index, tensor) {
          if (this.closed_) {
              throw new Error(`TensorArray ${this.name} has already been closed.`);
          }
          if (index < 0 || !this.dynamicSize && index >= this.maxSize) {
              throw new Error(`Tried to write to index ${index}, but array is not resizeable and size is: ${this.maxSize}`);
          }
          const t = this.tensors[index] || {};
          if (tensor.dtype !== this.dtype) {
              throw new Error(`TensorArray ${this.name}: Could not write to TensorArray index ${index},
          because the value dtype is ${tensor.dtype}, but TensorArray dtype is ${this.dtype}.`);
          }
          // Set the shape for the first time write to unknow shape tensor array
          if (this.size() === 0 &&
              (this.elementShape == null || this.elementShape.length === 0)) {
              this.elementShape = tensor.shape;
          }
          assertShapesMatchAllowUndefinedSize(this.elementShape, tensor.shape, `TensorArray ${this.name}: Could not write to TensorArray index ${index}.`);
          if (t.read) {
              throw new Error(`TensorArray ${this.name}: Could not write to TensorArray index ${index}, because it has already been read.`);
          }
          if (t.written) {
              throw new Error(`TensorArray ${this.name}: Could not write to TensorArray index ${index}, because it has already been written.`);
          }
          t.tensor = tensor;
          tfc.keep(tensor);
          t.written = true;
          this.tensors[index] = t;
      }
      /**
       * Helper method to write multiple tensors to the specified indices.
       */
      writeMany(indices, tensors) {
          if (indices.length !== tensors.length) {
              throw new Error(`TensorArray ${this.name}: could not write multiple tensors,` +
                  `because the index size: ${indices.length} is not the same as tensors size: ${tensors.length}.`);
          }
          indices.forEach((i, index) => this.write(i, tensors[index]));
      }
      /**
       * Return selected values in the TensorArray as a packed Tensor. All of
       * selected values must have been written and their shapes must all match.
       * @param [indices] number[] Optional. Taking values in [0, max_value). If the
       *    TensorArray is not dynamic, max_value=size(). If not specified returns
       *    all tensors in the original order.
       * @param [dtype]
       */
      gather(indices, dtype) {
          if (!!dtype && dtype !== this.dtype) {
              throw new Error(`TensorArray dtype is ${this.dtype} but gather requested dtype ${dtype}`);
          }
          if (!indices) {
              indices = [];
              for (let i = 0; i < this.size(); i++) {
                  indices.push(i);
              }
          }
          else {
              indices = indices.slice(0, this.size());
          }
          if (indices.length === 0) {
              return tfc.tensor([], [0].concat(this.elementShape));
          }
          // Read all the PersistentTensors into a vector to keep track of
          // their memory.
          const tensors = this.readMany(indices);
          assertShapesMatchAllowUndefinedSize(this.elementShape, tensors[0].shape, 'TensorArray shape mismatch: ');
          return tfc.stack(tensors, 0);
      }
      /**
       * Return the values in the TensorArray as a concatenated Tensor.
       */
      concat(dtype) {
          if (!!dtype && dtype !== this.dtype) {
              throw new Error(`TensorArray dtype is ${this.dtype} but concat requested dtype ${dtype}`);
          }
          if (this.size() === 0) {
              return tfc.tensor([], [0].concat(this.elementShape));
          }
          const indices = [];
          for (let i = 0; i < this.size(); i++) {
              indices.push(i);
          }
          // Collect all the tensors from the tensors array.
          const tensors = this.readMany(indices);
          assertShapesMatchAllowUndefinedSize(this.elementShape, tensors[0].shape, `TensorArray shape mismatch: tensor array shape (${this.elementShape}) vs first tensor shape (${tensors[0].shape})`);
          return tfc.concat(tensors, 0);
      }
      /**
       * Scatter the values of a Tensor in specific indices of a TensorArray.
       * @param indices nummber[] values in [0, max_value). If the
       *    TensorArray is not dynamic, max_value=size().
       * @param tensor Tensor input tensor.
       */
      scatter(indices, tensor) {
          if (tensor.dtype !== this.dtype) {
              throw new Error(`TensorArray dtype is ${this.dtype} but tensor has dtype ${tensor.dtype}`);
          }
          if (indices.length !== tensor.shape[0]) {
              throw new Error(`Expected len(indices) == tensor.shape[0], but saw: ${indices.length} vs. ${tensor.shape[0]}`);
          }
          const maxIndex = Math.max(...indices);
          if (!this.dynamicSize && maxIndex >= this.maxSize) {
              throw new Error(`Max index must be < array size (${maxIndex}  vs. ${this.maxSize})`);
          }
          this.writeMany(indices, tfc.unstack(tensor, 0));
      }
      /**
       * Split the values of a Tensor into the TensorArray.
       * @param length number[] with the lengths to use when splitting value along
       *    its first dimension.
       * @param tensor Tensor, the tensor to split.
       */
      split(length, tensor) {
          if (tensor.dtype !== this.dtype) {
              throw new Error(`TensorArray dtype is ${this.dtype} but tensor has dtype ${tensor.dtype}`);
          }
          let totalLength = 0;
          const cumulativeLengths = length.map(len => {
              totalLength += len;
              return totalLength;
          });
          if (totalLength !== tensor.shape[0]) {
              throw new Error(`Expected sum of lengths to be equal to
          tensor.shape[0], but sum of lengths is
        ${totalLength}, and tensor's shape is: ${tensor.shape}`);
          }
          if (!this.dynamicSize && length.length !== this.maxSize) {
              throw new Error(`TensorArray's size is not equal to the size of lengths (${this.maxSize} vs. ${length.length}), ` +
                  'and the TensorArray is not marked as dynamically resizeable');
          }
          const elementPerRow = totalLength === 0 ? 0 : tensor.size / totalLength;
          const tensors = [];
          tfc.tidy(() => {
              tensor = tfc.reshape(tensor, [1, totalLength, elementPerRow]);
              for (let i = 0; i < length.length; ++i) {
                  const previousLength = (i === 0) ? 0 : cumulativeLengths[i - 1];
                  const indices = [0, previousLength, 0];
                  const sizes = [1, length[i], elementPerRow];
                  tensors[i] = tfc.reshape(tfc.slice(tensor, indices, sizes), this.elementShape);
              }
              return tensors;
          });
          const indices = [];
          for (let i = 0; i < length.length; i++) {
              indices[i] = i;
          }
          this.writeMany(indices, tensors);
      }
  }

  /**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
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
  /**
   * TensorList stores a container of `tf.Tensor` objects, which are accessible
   * via tensors field.
   *
   * In order to get a copy of the underlying list, use the copy method:
   * ```
   *    TensorList b = a.copy();
   *    b.tensors().pushBack(t);  // This does not modify a.tensors().
   * ```
   *
   * Note that this is not a deep copy: the memory locations of the underlying
   * tensors will still point to the same locations of the corresponding tensors
   * in the original.
   */
  class TensorList {
      /**
       *
       * @param tensors list of tensors
       * @param elementShape shape of each tensor, this can be a single number (any
       * shape is allowed) or partial shape (dim = -1).
       * @param elementDtype data type of each tensor
       * @param maxNumElements The maximum allowed size of `tensors`. Defaults to -1
       *   meaning that the size of `tensors` is unbounded.
       */
      constructor(tensors, elementShape, elementDtype, maxNumElements = -1) {
          this.tensors = tensors;
          this.elementShape = elementShape;
          this.elementDtype = elementDtype;
          if (tensors != null) {
              tensors.forEach(tensor => {
                  if (elementDtype !== tensor.dtype) {
                      throw new Error(`Invalid data types; op elements ${elementDtype}, but list elements ${tensor.dtype}`);
                  }
                  assertShapesMatchAllowUndefinedSize(elementShape, tensor.shape, 'TensorList shape mismatch: ');
                  tfc.keep(tensor);
              });
          }
          this.idTensor = tfc.scalar(0);
          this.maxNumElements = maxNumElements;
          tfc.keep(this.idTensor);
      }
      get id() {
          return this.idTensor.id;
      }
      /**
       * Get a new TensorList containing a copy of the underlying tensor container.
       */
      copy() {
          return new TensorList([...this.tensors], this.elementShape, this.elementDtype);
      }
      /**
       * Dispose the tensors and idTensor and clear the tensor list.
       */
      clearAndClose(keepIds) {
          this.tensors.forEach(tensor => {
              if (keepIds == null || !keepIds.has(tensor.id)) {
                  tensor.dispose();
              }
          });
          this.tensors.length = 0;
          this.idTensor.dispose();
      }
      /**
       * The size of the tensors in the tensor list.
       */
      size() {
          return this.tensors.length;
      }
      /**
       * Return a tensor that stacks a list of rank-R tf.Tensors into one rank-(R+1)
       * tf.Tensor.
       * @param elementShape shape of each tensor
       * @param elementDtype data type of each tensor
       * @param numElements the number of elements to stack
       */
      stack(elementShape, elementDtype, numElements = -1) {
          if (elementDtype !== this.elementDtype) {
              throw new Error(`Invalid data types; op elements ${elementDtype}, but list elements ${this.elementDtype}`);
          }
          if (numElements !== -1 && this.tensors.length !== numElements) {
              throw new Error(`Operation expected a list with ${numElements} elements but got a list with ${this.tensors.length} elements.`);
          }
          assertShapesMatchAllowUndefinedSize(elementShape, this.elementShape, 'TensorList shape mismatch: ');
          const outputElementShape = inferElementShape(this.elementShape, this.tensors, elementShape);
          return tfc.tidy(() => {
              const reshapedTensors = this.tensors.map(tensor => tfc.reshape(tensor, outputElementShape));
              return tfc.stack(reshapedTensors, 0);
          });
      }
      /**
       * Pop a tensor from the end of the list.
       * @param elementShape shape of the tensor
       * @param elementDtype data type of the tensor
       */
      popBack(elementShape, elementDtype) {
          if (elementDtype !== this.elementDtype) {
              throw new Error(`Invalid data types; op elements ${elementDtype}, but list elements ${this.elementDtype}`);
          }
          if (this.size() === 0) {
              throw new Error('Trying to pop from an empty list.');
          }
          const outputElementShape = inferElementShape(this.elementShape, this.tensors, elementShape);
          const tensor = this.tensors.pop();
          assertShapesMatchAllowUndefinedSize(tensor.shape, elementShape, 'TensorList shape mismatch: ');
          return tfc.reshape(tensor, outputElementShape);
      }
      /**
       * Push a tensor to the end of the list.
       * @param tensor Tensor to be pushed.
       */
      pushBack(tensor) {
          if (tensor.dtype !== this.elementDtype) {
              throw new Error(`Invalid data types; op elements ${tensor.dtype}, but list elements ${this.elementDtype}`);
          }
          assertShapesMatchAllowUndefinedSize(tensor.shape, this.elementShape, 'TensorList shape mismatch: ');
          if (this.maxNumElements === this.size()) {
              throw new Error(`Trying to push element into a full list.`);
          }
          tfc.keep(tensor);
          this.tensors.push(tensor);
      }
      /**
       * Update the size of the list.
       * @param size the new size of the list.
       */
      resize(size) {
          if (size < 0) {
              throw new Error(`TensorListResize expects size to be non-negative. Got: ${size}`);
          }
          if (this.maxNumElements !== -1 && size > this.maxNumElements) {
              throw new Error(`TensorListResize input size ${size} is greater maxNumElement ${this.maxNumElements}.`);
          }
          this.tensors.length = size;
      }
      /**
       * Retrieve the element at the provided index
       * @param elementShape shape of the tensor
       * @param elementDtype dtype of the tensor
       * @param elementIndex index of the tensor
       */
      getItem(elementIndex, elementShape, elementDtype) {
          if (elementDtype !== this.elementDtype) {
              throw new Error(`Invalid data types; op elements ${elementDtype}, but list elements ${this.elementDtype}`);
          }
          if (elementIndex < 0 || elementIndex > this.tensors.length) {
              throw new Error(`Trying to access element ${elementIndex} in a list with ${this.tensors.length} elements.`);
          }
          if (this.tensors[elementIndex] == null) {
              throw new Error(`element at index ${elementIndex} is null.`);
          }
          assertShapesMatchAllowUndefinedSize(this.tensors[elementIndex].shape, elementShape, 'TensorList shape mismatch: ');
          const outputElementShape = inferElementShape(this.elementShape, this.tensors, elementShape);
          return tfc.reshape(this.tensors[elementIndex], outputElementShape);
      }
      /**
       * Set the tensor at the index
       * @param elementIndex index of the tensor
       * @param tensor the tensor to be inserted into the list
       */
      setItem(elementIndex, tensor) {
          if (tensor.dtype !== this.elementDtype) {
              throw new Error(`Invalid data types; op elements ${tensor.dtype}, but list elements ${this.elementDtype}`);
          }
          if (elementIndex < 0 ||
              this.maxNumElements !== -1 && elementIndex >= this.maxNumElements) {
              throw new Error(`Trying to set element ${elementIndex} in a list with max ${this.maxNumElements} elements.`);
          }
          assertShapesMatchAllowUndefinedSize(this.elementShape, tensor.shape, 'TensorList shape mismatch: ');
          tfc.keep(tensor);
          this.tensors[elementIndex] = tensor;
      }
      /**
       * Return selected values in the TensorList as a stacked Tensor. All of
       * selected values must have been written and their shapes must all match.
       * @param indices indices of tensors to gather
       * @param elementDtype output tensor dtype
       * @param elementShape output tensor element shape
       */
      gather(indices, elementDtype, elementShape) {
          if (elementDtype !== this.elementDtype) {
              throw new Error(`Invalid data types; op elements ${elementDtype}, but list elements ${this.elementDtype}`);
          }
          assertShapesMatchAllowUndefinedSize(this.elementShape, elementShape, 'TensorList shape mismatch: ');
          // When indices is greater than the size of the list, indices beyond the
          // size of the list are ignored.
          indices = indices.slice(0, this.size());
          const outputElementShape = inferElementShape(this.elementShape, this.tensors, elementShape);
          if (indices.length === 0) {
              return tfc.tensor([], [0].concat(outputElementShape));
          }
          return tfc.tidy(() => {
              const tensors = indices.map(i => tfc.reshape(this.tensors[i], outputElementShape));
              return tfc.stack(tensors, 0);
          });
      }
      /**
       * Return the values in the TensorList as a concatenated Tensor.
       * @param elementDtype output tensor dtype
       * @param elementShape output tensor element shape
       */
      concat(elementDtype, elementShape) {
          if (!!elementDtype && elementDtype !== this.elementDtype) {
              throw new Error(`TensorList dtype is ${this.elementDtype} but concat requested dtype ${elementDtype}`);
          }
          assertShapesMatchAllowUndefinedSize(this.elementShape, elementShape, 'TensorList shape mismatch: ');
          const outputElementShape = inferElementShape(this.elementShape, this.tensors, elementShape);
          if (this.size() === 0) {
              return tfc.tensor([], [0].concat(outputElementShape));
          }
          return tfc.tidy(() => {
              const tensors = this.tensors.map(t => tfc.reshape(t, outputElementShape));
              return tfc.concat(tensors, 0);
          });
      }
  }
  /**
   * Creates a TensorList which, when stacked, has the value of tensor.
   * @param tensor from tensor
   * @param elementShape output tensor element shape
   */
  function fromTensor(tensor, elementShape, elementDtype) {
      const dtype = tensor.dtype;
      if (tensor.shape.length < 1) {
          throw new Error(`Tensor must be at least a vector, but saw shape: ${tensor.shape}`);
      }
      if (tensor.dtype !== elementDtype) {
          throw new Error(`Invalid data types; op elements ${tensor.dtype}, but list elements ${elementDtype}`);
      }
      const tensorElementShape = tensor.shape.slice(1);
      assertShapesMatchAllowUndefinedSize(tensorElementShape, elementShape, 'TensorList shape mismatch: ');
      const tensorList = tfc.unstack(tensor);
      return new TensorList(tensorList, elementShape, dtype);
  }
  /**
   * Return a TensorList of the given size with empty elements.
   * @param elementShape the shape of the future elements of the list
   * @param elementDtype the desired type of elements in the list
   * @param numElements the number of elements to reserve
   */
  function reserve(elementShape, elementDtype, numElements) {
      return new TensorList([], elementShape, elementDtype, numElements);
  }
  /**
   * Put tensors at specific indices of a stacked tensor into a TensorList.
   * @param indices list of indices on how to scatter the tensor.
   * @param tensor input tensor.
   * @param elementShape the shape of the future elements of the list
   * @param numElements the number of elements to scatter
   */
  function scatter(tensor, indices, elementShape, numElements) {
      if (indices.length !== tensor.shape[0]) {
          throw new Error(`Expected len(indices) == tensor.shape[0], but saw: ${indices.length} vs. ${tensor.shape[0]}`);
      }
      const maxIndex = Math.max(...indices);
      if (numElements != null && numElements !== -1 && maxIndex >= numElements) {
          throw new Error(`Max index must be < array size (${maxIndex}  vs. ${numElements})`);
      }
      const list = new TensorList([], elementShape, tensor.dtype, numElements);
      const tensors = tfc.unstack(tensor, 0);
      indices.forEach((value, index) => {
          list.setItem(value, tensors[index]);
      });
      return list;
  }
  /**
   * Split the values of a Tensor into a TensorList.
   * @param length the lengths to use when splitting value along
   *    its first dimension.
   * @param tensor the tensor to split.
   * @param elementShape the shape of the future elements of the list
   */
  function split(tensor, length, elementShape) {
      let totalLength = 0;
      const cumulativeLengths = length.map(len => {
          totalLength += len;
          return totalLength;
      });
      if (totalLength !== tensor.shape[0]) {
          throw new Error(`Expected sum of lengths to be equal to
          tensor.shape[0], but sum of lengths is
        ${totalLength}, and tensor's shape is: ${tensor.shape}`);
      }
      const shapeWithoutFirstDim = tensor.shape.slice(1);
      const outputElementShape = mergeElementShape(shapeWithoutFirstDim, elementShape);
      const elementPerRow = totalLength === 0 ? 0 : tensor.size / totalLength;
      const tensors = tfc.tidy(() => {
          const tensors = [];
          tensor = tfc.reshape(tensor, [1, totalLength, elementPerRow]);
          for (let i = 0; i < length.length; ++i) {
              const previousLength = (i === 0) ? 0 : cumulativeLengths[i - 1];
              const indices = [0, previousLength, 0];
              const sizes = [1, length[i], elementPerRow];
              tensors[i] = tfc.reshape(tfc.slice(tensor, indices, sizes), outputElementShape);
          }
          tensor.dispose();
          return tensors;
      });
      const list = new TensorList([], elementShape, tensor.dtype, length.length);
      for (let i = 0; i < tensors.length; i++) {
          list.setItem(i, tensors[i]);
      }
      return list;
  }

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
  const executeOp$2 = async (node, tensorMap, context) => {
      switch (node.op) {
          case 'If':
          case 'StatelessIf': {
              const thenFunc = getParamValue('thenBranch', node, tensorMap, context);
              const elseFunc = getParamValue('elseBranch', node, tensorMap, context);
              const cond = getParamValue('cond', node, tensorMap, context);
              const args = getParamValue('args', node, tensorMap, context);
              const condValue = await cond.data();
              if (condValue[0]) {
                  return context.functionMap[thenFunc].executeFunctionAsync(args, context.tensorArrayMap, context.tensorListMap);
              }
              else {
                  return context.functionMap[elseFunc].executeFunctionAsync(args, context.tensorArrayMap, context.tensorListMap);
              }
          }
          case 'While':
          case 'StatelessWhile': {
              const bodyFunc = getParamValue('body', node, tensorMap, context);
              const condFunc = getParamValue('cond', node, tensorMap, context);
              const args = getParamValue('args', node, tensorMap, context);
              // Calculate the condition of the loop
              const condResult = (await context.functionMap[condFunc].executeFunctionAsync(args, context.tensorArrayMap, context.tensorListMap));
              const argIds = args.map(tensor => tensor.id);
              let condValue = await condResult[0].data();
              // Dispose the intermediate tensors for condition function
              condResult.forEach(tensor => {
                  if (!tensor.kept && argIds.indexOf(tensor.id) === -1) {
                      tensor.dispose();
                  }
              });
              let result = args;
              while (condValue[0]) {
                  // Record the previous result for intermediate tensor tracking
                  const origResult = result;
                  // Execution the body of the loop
                  result = await context.functionMap[bodyFunc].executeFunctionAsync(result, context.tensorArrayMap, context.tensorListMap);
                  const resultIds = result.map(tensor => tensor.id);
                  // Dispose the intermediate tensor for body function that is not global
                  // kept, not input/output of the body function
                  origResult.forEach(tensor => {
                      if (!tensor.kept && argIds.indexOf(tensor.id) === -1 &&
                          resultIds.indexOf(tensor.id) === -1) {
                          tensor.dispose();
                      }
                  });
                  // Recalcuate the condition of the loop using the latest results.
                  const condResult = (await context.functionMap[condFunc].executeFunctionAsync(result, context.tensorArrayMap, context.tensorListMap));
                  condValue = await condResult[0].data();
                  // Dispose the intermediate tensors for condition function
                  condResult.forEach(tensor => {
                      if (!tensor.kept && argIds.indexOf(tensor.id) === -1 &&
                          resultIds.indexOf(tensor.id) === -1) {
                          tensor.dispose();
                      }
                  });
              }
              return result;
          }
          case 'LoopCond': {
              const pred = getParamValue('pred', node, tensorMap, context);
              return [cloneTensor(pred)];
          }
          case 'Switch': {
              const pred = getParamValue('pred', node, tensorMap, context);
              let data = getParamValue('data', node, tensorMap, context);
              if (!data.kept) {
                  data = cloneTensor(data);
              }
              // Outputs nodes :0 => false, :1 => true
              return (await pred.data())[0] ? [undefined, data] : [data, undefined];
          }
          case 'Merge': {
              const inputName = node.inputNames.find(name => getTensor(name, tensorMap, context) !== undefined);
              if (inputName) {
                  const data = getTensor(inputName, tensorMap, context);
                  return [cloneTensor(data)];
              }
              return undefined;
          }
          case 'Enter': {
              const frameId = getParamValue('frameName', node, tensorMap, context);
              const data = getParamValue('tensor', node, tensorMap, context);
              context.enterFrame(frameId);
              return [cloneTensor(data)];
          }
          case 'Exit': {
              const data = getParamValue('tensor', node, tensorMap, context);
              context.exitFrame();
              return [cloneTensor(data)];
          }
          case 'NextIteration': {
              const data = getParamValue('tensor', node, tensorMap, context);
              context.nextIteration();
              return [cloneTensor(data)];
          }
          case 'TensorArrayV3': {
              const size = getParamValue('size', node, tensorMap, context);
              const dtype = getParamValue('dtype', node, tensorMap, context);
              const elementShape = getParamValue('elementShape', node, tensorMap, context);
              const dynamicSize = getParamValue('dynamicSize', node, tensorMap, context);
              const clearAfterRead = getParamValue('clearAfterRead', node, tensorMap, context);
              const identicalElementShapes = getParamValue('identicalElementShapes', node, tensorMap, context);
              const name = getParamValue('name', node, tensorMap, context);
              const tensorArray = new TensorArray(name, dtype, size, elementShape, identicalElementShapes, dynamicSize, clearAfterRead);
              context.addTensorArray(tensorArray);
              return [tensorArray.idTensor, tfc.scalar(1.0)];
          }
          case 'TensorArrayWriteV3': {
              const id = getParamValue('tensorArrayId', node, tensorMap, context);
              const index = getParamValue('index', node, tensorMap, context);
              const writeTensor = getParamValue('tensor', node, tensorMap, context);
              const writeTensorArray = context.getTensorArray(id.id);
              writeTensorArray.write(index, writeTensor);
              return [writeTensorArray.idTensor];
          }
          case 'TensorArrayReadV3': {
              const readId = getParamValue('tensorArrayId', node, tensorMap, context);
              const readIndex = getParamValue('index', node, tensorMap, context);
              const readTensorArray = context.getTensorArray(readId.id);
              return [readTensorArray.read(readIndex)];
          }
          case 'TensorArrayGatherV3': {
              const gatherId = getParamValue('tensorArrayId', node, tensorMap, context);
              const gatherIndices = getParamValue('indices', node, tensorMap, context);
              const gatherDtype = getParamValue('dtype', node, tensorMap, context);
              const gatherTensorArray = context.getTensorArray(gatherId.id);
              return [gatherTensorArray.gather(gatherIndices, gatherDtype)];
          }
          case 'TensorArrayScatterV3': {
              const scatterId = getParamValue('tensorArrayId', node, tensorMap, context);
              const scatterIndices = getParamValue('indices', node, tensorMap, context);
              const scatterTensor = getParamValue('tensor', node, tensorMap, context);
              const scatterTensorArray = context.getTensorArray(scatterId.id);
              scatterTensorArray.scatter(scatterIndices, scatterTensor);
              return [scatterTensorArray.idTensor];
          }
          case 'TensorArrayConcatV3': {
              const concatId = getParamValue('tensorArrayId', node, tensorMap, context);
              const concatTensorArray = context.getTensorArray(concatId.id);
              const concatDtype = getParamValue('dtype', node, tensorMap, context);
              return [concatTensorArray.concat(concatDtype)];
          }
          case 'TensorArraySplitV3': {
              const splitId = getParamValue('tensorArrayId', node, tensorMap, context);
              const splitTensor = getParamValue('tensor', node, tensorMap, context);
              const lengths = getParamValue('lengths', node, tensorMap, context);
              const splitTensorArray = context.getTensorArray(splitId.id);
              splitTensorArray.split(lengths, splitTensor);
              return [splitTensorArray.idTensor];
          }
          case 'TensorArraySizeV3': {
              const sizeId = getParamValue('tensorArrayId', node, tensorMap, context);
              const sizeTensorArray = context.getTensorArray(sizeId.id);
              return [tfc.scalar(sizeTensorArray.size(), 'int32')];
          }
          case 'TensorArrayCloseV3': {
              const closeId = getParamValue('tensorArrayId', node, tensorMap, context);
              const closeTensorArray = context.getTensorArray(closeId.id);
              closeTensorArray.clearAndClose();
              return [closeTensorArray.idTensor];
          }
          case 'TensorListSetItem': {
              const idTensor = getParamValue('tensorListId', node, tensorMap, context);
              const index = getParamValue('index', node, tensorMap, context);
              const writeTensor = getParamValue('tensor', node, tensorMap, context);
              const tensorList = context.getTensorList(idTensor.id);
              tensorList.setItem(index, writeTensor);
              return [tensorList.idTensor];
          }
          case 'TensorListGetItem': {
              const idTensor = getParamValue('tensorListId', node, tensorMap, context);
              const readIndex = getParamValue('index', node, tensorMap, context);
              const elementShape = getParamValue('elementShape', node, tensorMap, context);
              const elementDType = getParamValue('elementDType', node, tensorMap, context);
              const tensorList = context.getTensorList(idTensor.id);
              return [tensorList.getItem(readIndex, elementShape, elementDType)];
          }
          case 'TensorListScatterV2':
          case 'TensorListScatter': {
              const scatterIndices = getParamValue('indices', node, tensorMap, context);
              const scatterTensor = getParamValue('tensor', node, tensorMap, context);
              const elementShape = getParamValue('elementShape', node, tensorMap, context);
              const numElements = getParamValue('numElements', node, tensorMap, context);
              const tensorList = scatter(scatterTensor, scatterIndices, elementShape, numElements);
              context.addTensorList(tensorList);
              return [tensorList.idTensor];
          }
          case 'TensorListReserve':
          case 'EmptyTensorList': {
              const elementShape = getParamValue('elementShape', node, tensorMap, context);
              const elementDtype = getParamValue('elementDType', node, tensorMap, context);
              let numElementsParam;
              if (node.op === 'TensorListReserve') {
                  numElementsParam = 'numElements';
              }
              else {
                  numElementsParam = 'maxNumElements';
              }
              const numElements = getParamValue(numElementsParam, node, tensorMap, context);
              const tensorList = reserve(elementShape, elementDtype, numElements);
              context.addTensorList(tensorList);
              return [tensorList.idTensor];
          }
          case 'TensorListGather': {
              const gatherId = getParamValue('tensorListId', node, tensorMap, context);
              const gatherIndices = getParamValue('indices', node, tensorMap, context);
              const elementShape = getParamValue('elementShape', node, tensorMap, context);
              const elementDtype = getParamValue('elementDType', node, tensorMap, context);
              const tensorList = context.getTensorList(gatherId.id);
              return [tensorList.gather(gatherIndices, elementDtype, elementShape)];
          }
          case 'TensorListStack': {
              const idTensor = getParamValue('tensorListId', node, tensorMap, context);
              const elementShape = getParamValue('elementShape', node, tensorMap, context);
              const elementDtype = getParamValue('elementDType', node, tensorMap, context);
              const numElements = getParamValue('numElements', node, tensorMap, context);
              const tensorList = context.getTensorList(idTensor.id);
              return [tensorList.stack(elementShape, elementDtype, numElements)];
          }
          case 'TensorListFromTensor': {
              const tensor = getParamValue('tensor', node, tensorMap, context);
              const elementShape = getParamValue('elementShape', node, tensorMap, context);
              const elementDtype = getParamValue('elementDType', node, tensorMap, context);
              const tensorList = fromTensor(tensor, elementShape, elementDtype);
              context.addTensorList(tensorList);
              return [tensorList.idTensor];
          }
          case 'TensorListConcat': {
              const concatId = getParamValue('tensorListId', node, tensorMap, context);
              const tensorList = context.getTensorList(concatId.id);
              const concatDtype = getParamValue('dtype', node, tensorMap, context);
              const elementShape = getParamValue('elementShape', node, tensorMap, context);
              return [tensorList.concat(concatDtype, elementShape)];
          }
          case 'TensorListPushBack': {
              const idTensor = getParamValue('tensorListId', node, tensorMap, context);
              const writeTensor = getParamValue('tensor', node, tensorMap, context);
              const tensorList = context.getTensorList(idTensor.id);
              tensorList.pushBack(writeTensor);
              return [tensorList.idTensor];
          }
          case 'TensorListPopBack': {
              const idTensor = getParamValue('tensorListId', node, tensorMap, context);
              const elementShape = getParamValue('elementShape', node, tensorMap, context);
              const elementDType = getParamValue('elementDType', node, tensorMap, context);
              const tensorList = context.getTensorList(idTensor.id);
              return [tensorList.popBack(elementShape, elementDType)];
          }
          case 'TensorListSplit': {
              const splitTensor = getParamValue('tensor', node, tensorMap, context);
              const elementShape = getParamValue('elementShape', node, tensorMap, context);
              const lengths = getParamValue('lengths', node, tensorMap, context);
              const tensorList = split(splitTensor, lengths, elementShape);
              context.addTensorList(tensorList);
              return [tensorList.idTensor];
          }
          default:
              throw TypeError(`Node type ${node.op} is not implemented`);
      }
  };

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
  const executeOp$3 = (node, tensorMap, context) => {
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
  const executeOp$4 = (node, tensorMap, context) => {
      switch (node.op) {
          case 'Fill': {
              const shape = getParamValue('shape', node, tensorMap, context);
              const dtype = getParamValue('dtype', node, tensorMap, context);
              const value = getParamValue('value', node, tensorMap, context);
              return [tfOps.fill(shape, value, dtype)];
          }
          case 'LinSpace': {
              const start = getParamValue('start', node, tensorMap, context);
              const stop = getParamValue('stop', node, tensorMap, context);
              const num = getParamValue('num', node, tensorMap, context);
              return [tfOps.linspace(start, stop, num)];
          }
          case 'Multinomial': {
              const logits = getParamValue('logits', node, tensorMap, context);
              const numSamples = getParamValue('numSamples', node, tensorMap, context);
              const seed = getParamValue('seed', node, tensorMap, context);
              return [tfOps.multinomial(logits, numSamples, seed)];
          }
          case 'OneHot': {
              const indices = getParamValue('indices', node, tensorMap, context);
              const depth = getParamValue('depth', node, tensorMap, context);
              const onValue = getParamValue('onValue', node, tensorMap, context);
              const offValue = getParamValue('offValue', node, tensorMap, context);
              return [tfOps.oneHot(indices, depth, onValue, offValue)];
          }
          case 'Ones': {
              return [tfOps.ones(getParamValue('shape', node, tensorMap, context), getParamValue('dtype', node, tensorMap, context))];
          }
          case 'OnesLike': {
              return [tfOps.onesLike(getParamValue('x', node, tensorMap, context))];
          }
          case 'RandomUniform': {
              return [tfOps.randomUniform(
                  // tslint:disable-next-line:no-any
                  getParamValue('shape', node, tensorMap, context), getParamValue('minval', node, tensorMap, context), getParamValue('maxval', node, tensorMap, context), getParamValue('dtype', node, tensorMap, context))];
          }
          case 'Range': {
              const start = getParamValue('start', node, tensorMap, context);
              const stop = getParamValue('stop', node, tensorMap, context);
              const step = getParamValue('step', node, tensorMap, context);
              return [tfOps.range(start, stop, step, getParamValue('dtype', node, tensorMap, context))];
          }
          case 'TruncatedNormal': {
              const shape = getParamValue('shape', node, tensorMap, context);
              const mean = getParamValue('mean', node, tensorMap, context);
              const stdDev = getParamValue('stdDev', node, tensorMap, context);
              const seed = getParamValue('seed', node, tensorMap, context);
              return [tfOps.truncatedNormal(shape, mean, stdDev, getParamValue('dtype', node, tensorMap, context), seed)];
          }
          case 'Zeros': {
              return [tfOps.zeros(getParamValue('shape', node, tensorMap, context), getParamValue('dtype', node, tensorMap, context))];
          }
          case 'ZerosLike': {
              return [tfOps.zerosLike(getParamValue('x', node, tensorMap, context))];
          }
          default:
              throw TypeError(`Node type ${node.op} is not implemented`);
      }
  };

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
  function nmsParams(node, tensorMap, context) {
      const boxes = getParamValue('boxes', node, tensorMap, context);
      const scores = getParamValue('scores', node, tensorMap, context);
      const maxOutputSize = getParamValue('maxOutputSize', node, tensorMap, context);
      const iouThreshold = getParamValue('iouThreshold', node, tensorMap, context);
      const scoreThreshold = getParamValue('scoreThreshold', node, tensorMap, context);
      const softNmsSigma = getParamValue('softNmsSigma', node, tensorMap, context);
      return {
          boxes,
          scores,
          maxOutputSize,
          iouThreshold,
          scoreThreshold,
          softNmsSigma
      };
  }
  const executeOp$5 = async (node, tensorMap, context) => {
      switch (node.op) {
          case 'NonMaxSuppressionV5': {
              const { boxes, scores, maxOutputSize, iouThreshold, scoreThreshold, softNmsSigma } = nmsParams(node, tensorMap, context);
              const result = await tfOps.image.nonMaxSuppressionWithScoreAsync(boxes, scores, maxOutputSize, iouThreshold, scoreThreshold, softNmsSigma);
              return [result.selectedIndices, result.selectedScores];
          }
          case 'NonMaxSuppressionV4': {
              const { boxes, scores, maxOutputSize, iouThreshold, scoreThreshold } = nmsParams(node, tensorMap, context);
              const padToMaxOutputSize = getParamValue('padToMaxOutputSize', node, tensorMap, context);
              const result = await tfOps.image.nonMaxSuppressionPaddedAsync(boxes, scores, maxOutputSize, iouThreshold, scoreThreshold, padToMaxOutputSize);
              return [result.selectedIndices, result.validOutputs];
          }
          case 'NonMaxSuppressionV3':
          case 'NonMaxSuppressionV2': {
              const { boxes, scores, maxOutputSize, iouThreshold, scoreThreshold } = nmsParams(node, tensorMap, context);
              return [await tfOps.image.nonMaxSuppressionAsync(boxes, scores, maxOutputSize, iouThreshold, scoreThreshold)];
          }
          case 'Where': {
              const condition = tfOps.cast(getParamValue('condition', node, tensorMap, context), 'bool');
              const result = [await tfOps.whereAsync(condition)];
              condition.dispose();
              return result;
          }
          case 'ListDiff': {
              return tfOps.setdiff1dAsync(getParamValue('x', node, tensorMap, context), getParamValue('y', node, tensorMap, context));
          }
          default:
              throw TypeError(`Node type ${node.op} is not implemented`);
      }
  };

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
  const executeOp$6 = (node, tensorMap, context) => {
      switch (node.op) {
          case 'TopKV2': {
              const x = getParamValue('x', node, tensorMap, context);
              const k = getParamValue('k', node, tensorMap, context);
              const sorted = getParamValue('sorted', node, tensorMap, context);
              const result = tfOps.topk(x, k, sorted);
              return [result.values, result.indices];
          }
          case 'Unique': {
              const x = getParamValue('x', node, tensorMap, context);
              const result = tfOps.unique(x);
              return [result.values, result.indices];
          }
          case 'UniqueV2': {
              const x = getParamValue('x', node, tensorMap, context);
              const axis = getParamValue('axis', node, tensorMap, context);
              const result = tfOps.unique(x, axis);
              return [result.values, result.indices];
          }
          default:
              throw TypeError(`Node type ${node.op} is not implemented`);
      }
  };

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
  const executeOp$7 = (node, tensorMap, context) => {
      switch (node.op) {
          case 'Const': {
              return tensorMap[node.name];
          }
          case 'PlaceholderWithDefault':
              const def = getParamValue('default', node, tensorMap, context);
              return [getTensor(node.name, tensorMap, context) || def];
          case 'Placeholder':
              return [getTensor(node.name, tensorMap, context)];
          case 'Identity':
          case 'StopGradient':
          case 'FakeQuantWithMinMaxVars': { // This op is currently ignored.
              const data = getParamValue('x', node, tensorMap, context);
              return [cloneTensor(data)];
          }
          case 'IdentityN':
              return getParamValue('x', node, tensorMap, context)
                  .map((t) => cloneTensor(t));
          case 'Snapshot':
              const snapshot = getParamValue('x', node, tensorMap, context);
              return [cloneTensor(snapshot)];
          case 'Shape':
              return [tfOps.tensor1d(getParamValue('x', node, tensorMap, context).shape, 'int32')];
          case 'ShapeN':
              return getParamValue('x', node, tensorMap, context)
                  .map((t) => tfOps.tensor1d(t.shape));
          case 'Size':
              return [tfOps.scalar(getParamValue('x', node, tensorMap, context).size, 'int32')];
          case 'Rank':
              return [tfOps.scalar(getParamValue('x', node, tensorMap, context).rank, 'int32')];
          case 'NoOp':
              return [tfOps.scalar(1)];
          case 'Print':
              const input = getParamValue('x', node, tensorMap, context);
              const data = getParamValue('data', node, tensorMap, context);
              const message = getParamValue('message', node, tensorMap, context);
              const summarize = getParamValue('summarize', node, tensorMap, context);
              console.warn('The graph has a tf.print() operation,' +
                  'usually used for debugging, which slows down performance.');
              console.log(message);
              for (let i = 0; i < data.length; i++) {
                  console.log(Array.prototype.slice.call(data[i].dataSync())
                      .slice(0, summarize));
              }
              return [input];
          default:
              throw TypeError(`Node type ${node.op} is not implemented`);
      }
  };

  /**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
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
  /**
   * Hashtable contains a set of tensors, which can be accessed by key.
   */
  class HashTable {
      /**
       * Constructor of HashTable. Creates a hash table.
       *
       * @param keyDType `dtype` of the table keys.
       * @param valueDType `dtype` of the table values.
       */
      constructor(keyDType, valueDType) {
          this.keyDType = keyDType;
          this.valueDType = valueDType;
          this.handle = tfc.scalar(0);
          // tslint:disable-next-line: no-any
          this.tensorMap = new Map();
          tfc.keep(this.handle);
      }
      get id() {
          return this.handle.id;
      }
      /**
       * Dispose the tensors and handle and clear the hashtable.
       */
      clearAndClose() {
          this.tensorMap.forEach(value => value.dispose());
          this.tensorMap.clear();
          this.handle.dispose();
      }
      /**
       * The number of items in the hash table.
       */
      size() {
          return this.tensorMap.size;
      }
      /**
       * The number of items in the hash table as a rank-0 tensor.
       */
      tensorSize() {
          return tfOps.scalar(this.size(), 'int32');
      }
      /**
       * Replaces the contents of the table with the specified keys and values.
       * @param keys Keys to store in the hashtable.
       * @param values Values to store in the hashtable.
       */
      async import(keys, values) {
          this.checkKeyAndValueTensor(keys, values);
          // We only store the primitive values of the keys, this allows lookup
          // to be O(1).
          const $keys = await keys.data();
          // Clear the hashTable before inserting new values.
          this.tensorMap.forEach(value => value.dispose());
          this.tensorMap.clear();
          return tfc.tidy(() => {
              const $values = tfc.unstack(values);
              const keysLength = $keys.length;
              const valuesLength = $values.length;
              tfc.util.assert(keysLength === valuesLength, () => `The number of elements doesn't match, keys has ` +
                  `${keysLength} elements, the values has ${valuesLength} ` +
                  `elements.`);
              for (let i = 0; i < keysLength; i++) {
                  const key = $keys[i];
                  const value = $values[i];
                  tfc.keep(value);
                  this.tensorMap.set(key, value);
              }
              return this.handle;
          });
      }
      /**
       * Looks up keys in a hash table, outputs the corresponding values.
       *
       * Performs batch lookups, for every element in the key tensor, `find`
       * stacks the corresponding value into the return tensor.
       *
       * If an element is not present in the table, the given `defaultValue` is
       * used.
       *
       * @param keys Keys to look up. Must have the same type as the keys of the
       *     table.
       * @param defaultValue The scalar `defaultValue` is the value output for keys
       *     not present in the table. It must also be of the same type as the
       *     table values.
       */
      async find(keys, defaultValue) {
          this.checkKeyAndValueTensor(keys, defaultValue);
          const $keys = await keys.data();
          return tfc.tidy(() => {
              const result = [];
              for (let i = 0; i < $keys.length; i++) {
                  const key = $keys[i];
                  const value = this.findWithDefault(key, defaultValue);
                  result.push(value);
              }
              return tfc.stack(result);
          });
      }
      // tslint:disable-next-line: no-any
      findWithDefault(key, defaultValue) {
          const result = this.tensorMap.get(key);
          return result != null ? result : defaultValue;
      }
      checkKeyAndValueTensor(key, value) {
          if (key.dtype !== this.keyDType) {
              throw new Error(`Expect key dtype ${this.keyDType}, but got ` +
                  `${key.dtype}`);
          }
          if (value.dtype !== this.valueDType) {
              throw new Error(`Expect value dtype ${this.valueDType}, but got ` +
                  `${value.dtype}`);
          }
      }
  }

  /**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
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
  const executeOp$8 = async (node, tensorMap, context, resourceManager) => {
      switch (node.op) {
          case 'HashTable':
          case 'HashTableV2': {
              const keyDType = getParamValue('keyDType', node, tensorMap, context);
              const valueDType = getParamValue('valueDType', node, tensorMap, context);
              const hashTable = new HashTable(keyDType, valueDType);
              resourceManager.addHashTable(node.name, hashTable);
              return [hashTable.handle];
          }
          case 'LookupTableImport':
          case 'LookupTableImportV2': {
              const handle = getParamValue('tableHandle', node, tensorMap, context, resourceManager);
              const keys = getParamValue('keys', node, tensorMap, context);
              const values = getParamValue('values', node, tensorMap, context);
              const hashTable = resourceManager.getHashTableById(handle.id);
              return [await hashTable.import(keys, values)];
          }
          case 'LookupTableFind':
          case 'LookupTableFindV2': {
              const handle = getParamValue('tableHandle', node, tensorMap, context, resourceManager);
              const keys = getParamValue('keys', node, tensorMap, context);
              const defaultValue = getParamValue('defaultValue', node, tensorMap, context);
              const hashTable = resourceManager.getHashTableById(handle.id);
              return [await hashTable.find(keys, defaultValue)];
          }
          case 'LookupTableSize':
          case 'LookupTableSizeV2': {
              const handle = getParamValue('tableHandle', node, tensorMap, context, resourceManager);
              const hashTable = resourceManager.getHashTableById(handle.id);
              return [hashTable.tensorSize()];
          }
          default:
              throw TypeError(`Node type ${node.op} is not implemented`);
      }
  };

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
  const executeOp$9 = (node, tensorMap, context) => {
      switch (node.op) {
          case 'ResizeBilinear': {
              const images = getParamValue('images', node, tensorMap, context);
              const size = getParamValue('size', node, tensorMap, context);
              const alignCorners = getParamValue('alignCorners', node, tensorMap, context);
              const halfPixelCenters = getParamValue('halfPixelCenters', node, tensorMap, context);
              return [tfOps.image.resizeBilinear(images, [size[0], size[1]], alignCorners, halfPixelCenters)];
          }
          case 'ResizeNearestNeighbor': {
              const images = getParamValue('images', node, tensorMap, context);
              const size = getParamValue('size', node, tensorMap, context);
              const alignCorners = getParamValue('alignCorners', node, tensorMap, context);
              const halfPixelCenters = getParamValue('halfPixelCenters', node, tensorMap, context);
              return [tfOps.image.resizeNearestNeighbor(images, [size[0], size[1]], alignCorners, halfPixelCenters)];
          }
          case 'CropAndResize': {
              const image = getParamValue('image', node, tensorMap, context);
              const boxes = getParamValue('boxes', node, tensorMap, context);
              const boxInd = getParamValue('boxInd', node, tensorMap, context);
              const cropSize = getParamValue('cropSize', node, tensorMap, context);
              const method = getParamValue('method', node, tensorMap, context);
              const extrapolationValue = getParamValue('extrapolationValue', node, tensorMap, context);
              return [tfOps.image.cropAndResize(image, boxes, boxInd, cropSize, method, extrapolationValue)];
          }
          default:
              throw TypeError(`Node type ${node.op} is not implemented`);
      }
  };

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
  const executeOp$a = (node, tensorMap, context) => {
      switch (node.op) {
          case 'Equal': {
              return [tfOps.equal(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
          }
          case 'NotEqual': {
              return [tfOps.notEqual(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
          }
          case 'Greater': {
              return [tfOps.greater(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
          }
          case 'GreaterEqual': {
              return [tfOps.greaterEqual(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
          }
          case 'Less': {
              return [tfOps.less(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
          }
          case 'LessEqual': {
              return [tfOps.lessEqual(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
          }
          case 'LogicalAnd': {
              return [tfOps.logicalAnd(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
          }
          case 'LogicalNot': {
              return [tfOps.logicalNot(getParamValue('a', node, tensorMap, context))];
          }
          case 'LogicalOr': {
              return [tfOps.logicalOr(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
          }
          case 'Select':
          case 'SelectV2': {
              return [tfOps.where(getParamValue('condition', node, tensorMap, context), getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
          }
          default:
              throw TypeError(`Node type ${node.op} is not implemented`);
      }
  };

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
  const executeOp$b = (node, tensorMap, context) => {
      switch (node.op) {
          case 'BatchMatMul':
          case 'BatchMatMulV2':
          case 'MatMul':
              return [tfOps.matMul(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context), getParamValue('transposeA', node, tensorMap, context), getParamValue('transposeB', node, tensorMap, context))];
          case 'Einsum':
              return [tfOps.einsum(getParamValue('equation', node, tensorMap, context), ...getParamValue('tensors', node, tensorMap, context))];
          case 'Transpose':
              return [tfOps.transpose(getParamValue('x', node, tensorMap, context), getParamValue('perm', node, tensorMap, context))];
          case '_FusedMatMul':
              const [extraOp, activationFunc] = getParamValue('fusedOps', node, tensorMap, context);
              const isBiasAdd = extraOp === 'biasadd';
              const isPrelu = activationFunc === 'prelu';
              const numArgs = getParamValue('numArgs', node, tensorMap, context);
              const leakyreluAlpha = getParamValue('leakyreluAlpha', node, tensorMap, context);
              if (isBiasAdd) {
                  if (isPrelu && numArgs !== 2) {
                      throw new Error('Fused MatMul with BiasAdd and Prelu must have two ' +
                          'extra arguments: bias and alpha.');
                  }
                  if (!isPrelu && numArgs !== 1) {
                      throw new Error('Fused MatMul with BiasAdd must have one extra argument: bias.');
                  }
              }
              const [biasArg, preluArg] = getParamValue('args', node, tensorMap, context);
              return [tfOps.fused.matMul({
                      a: getParamValue('a', node, tensorMap, context),
                      b: getParamValue('b', node, tensorMap, context),
                      transposeA: getParamValue('transposeA', node, tensorMap, context),
                      transposeB: getParamValue('transposeB', node, tensorMap, context),
                      bias: biasArg,
                      activation: activationFunc,
                      preluActivationWeights: preluArg,
                      leakyreluAlpha
                  })];
          default:
              throw TypeError(`Node type ${node.op} is not implemented`);
      }
  };

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
  const executeOp$c = (node, tensorMap, context) => {
      switch (node.op) {
          case 'FusedBatchNorm':
          case 'FusedBatchNormV2': {
              return [tfOps.batchNorm(getParamValue('x', node, tensorMap, context), getParamValue('mean', node, tensorMap, context), getParamValue('variance', node, tensorMap, context), getParamValue('offset', node, tensorMap, context), getParamValue('scale', node, tensorMap, context), getParamValue('epsilon', node, tensorMap, context))];
          }
          case 'FusedBatchNormV3': {
              return [tfOps.batchNorm(getParamValue('x', node, tensorMap, context), getParamValue('mean', node, tensorMap, context), getParamValue('variance', node, tensorMap, context), getParamValue('offset', node, tensorMap, context), getParamValue('scale', node, tensorMap, context), getParamValue('epsilon', node, tensorMap, context))];
          }
          case 'LRN': {
              return [tfOps.localResponseNormalization(getParamValue('x', node, tensorMap, context), getParamValue('radius', node, tensorMap, context), getParamValue('bias', node, tensorMap, context), getParamValue('alpha', node, tensorMap, context), getParamValue('beta', node, tensorMap, context))];
          }
          case 'Softmax': {
              return [tfOps.softmax(getParamValue('x', node, tensorMap, context))];
          }
          case 'LogSoftmax': {
              return [tfOps.logSoftmax(getParamValue('x', node, tensorMap, context))];
          }
          case 'SparseToDense': {
              return [tfOps.sparseToDense(getParamValue('sparseIndices', node, tensorMap, context), getParamValue('outputShape', node, tensorMap, context), getParamValue('sparseValues', node, tensorMap, context), getParamValue('defaultValue', node, tensorMap, context))];
          }
          default:
              throw TypeError(`Node type ${node.op} is not implemented`);
      }
  };

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
  const executeOp$d = (node, tensorMap, context) => {
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
  const executeOp$e = (node, tensorMap, context) => {
      switch (node.op) {
          case 'ConcatV2':
          case 'Concat': {
              const n = getParamValue('n', node, tensorMap, context);
              const axis = getParamValue('axis', node, tensorMap, context);
              let inputs = getParamValue('tensors', node, tensorMap, context);
              inputs = inputs.slice(0, n);
              return [tfOps.concat(inputs, axis)];
          }
          case 'Gather': {
              const input = getParamValue('x', node, tensorMap, context);
              const indices = getParamValue('indices', node, tensorMap, context);
              return [tfOps.gather(input, tfOps.cast(indices, 'int32'), 0)];
          }
          case 'GatherV2': {
              const axis = getParamValue('axis', node, tensorMap, context);
              const batchDims = getParamValue('batchDims', node, tensorMap, context);
              const input = getParamValue('x', node, tensorMap, context);
              const indices = getParamValue('indices', node, tensorMap, context);
              return [tfOps.gather(input, tfOps.cast(indices, 'int32'), axis, batchDims)];
          }
          case 'Reverse': {
              const dims = getParamValue('dims', node, tensorMap, context);
              const axis = [];
              for (let i = 0; i < dims.length; i++) {
                  if (dims[i]) {
                      axis.push(i);
                  }
              }
              const input = getParamValue('x', node, tensorMap, context);
              return [tfOps.reverse(input, axis)];
          }
          case 'ReverseV2': {
              const axis = getParamValue('axis', node, tensorMap, context);
              const input = getParamValue('x', node, tensorMap, context);
              return [tfOps.reverse(input, axis)];
          }
          case 'Slice': {
              // tslint:disable-next-line:no-any
              const begin = getParamValue('begin', node, tensorMap, context);
              // tslint:disable-next-line:no-any
              const size = getParamValue('size', node, tensorMap, context);
              return [tfOps.slice(getParamValue('x', node, tensorMap, context), begin, size)];
          }
          case 'StridedSlice': {
              const begin = getParamValue('begin', node, tensorMap, context);
              const end = getParamValue('end', node, tensorMap, context);
              const strides = getParamValue('strides', node, tensorMap, context);
              const beginMask = getParamValue('beginMask', node, tensorMap, context);
              const endMask = getParamValue('endMask', node, tensorMap, context);
              const ellipsisMask = getParamValue('ellipsisMask', node, tensorMap, context);
              const newAxisMask = getParamValue('newAxisMask', node, tensorMap, context);
              const shrinkAxisMask = getParamValue('shrinkAxisMask', node, tensorMap, context);
              const tensor = getParamValue('x', node, tensorMap, context);
              return [tfOps.stridedSlice(tensor, begin, end, strides, beginMask, endMask, ellipsisMask, newAxisMask, shrinkAxisMask)];
          }
          case 'Pack': {
              return tfc.tidy(() => {
                  const axis = getParamValue('axis', node, tensorMap, context);
                  const tensors = getParamValue('tensors', node, tensorMap, context);
                  // Reshape the tensors to the first tensor's shape if they don't
                  // match.
                  const shape = tensors[0].shape;
                  const squeezedShape = tfOps.squeeze(tensors[0]).shape;
                  const mapped = tensors.map(tensor => {
                      const sameShape = tfc.util.arraysEqual(tensor.shape, shape);
                      if (!sameShape &&
                          !tfc.util.arraysEqual(tfOps.squeeze(tensor).shape, squeezedShape)) {
                          throw new Error('the input tensors shape does not match');
                      }
                      return sameShape ? tensor : tfOps.reshape(tensor, shape);
                  });
                  return [tfOps.stack(mapped, axis)];
              });
          }
          case 'Unpack': {
              const axis = getParamValue('axis', node, tensorMap, context);
              const tensor = getParamValue('tensor', node, tensorMap, context);
              return tfOps.unstack(tensor, axis);
          }
          case 'Tile': {
              const reps = getParamValue('reps', node, tensorMap, context);
              return [tfOps.tile(getParamValue('x', node, tensorMap, context), reps)];
          }
          case 'Split':
          case 'SplitV': {
              const axis = getParamValue('axis', node, tensorMap, context);
              const numOrSizeSplits = getParamValue('numOrSizeSplits', node, tensorMap, context);
              const tensor = getParamValue('x', node, tensorMap, context);
              return tfOps.split(tensor, numOrSizeSplits, axis);
          }
          case 'ScatterNd': {
              const indices = getParamValue('indices', node, tensorMap, context);
              const values = getParamValue('values', node, tensorMap, context);
              const shape = getParamValue('shape', node, tensorMap, context);
              return [tfOps.scatterND(indices, values, shape)];
          }
          case 'GatherNd': {
              const x = getParamValue('x', node, tensorMap, context);
              const indices = getParamValue('indices', node, tensorMap, context);
              return [tfOps.gatherND(x, indices)];
          }
          case 'SparseToDense': {
              const indices = getParamValue('sparseIndices', node, tensorMap, context);
              const shape = getParamValue('outputShape', node, tensorMap, context);
              const sparseValues = getParamValue('sparseValues', node, tensorMap, context);
              const defaultValue = getParamValue('defaultValue', node, tensorMap, context);
              return [tfOps.sparseToDense(indices, sparseValues, shape, sparseValues.dtype === defaultValue.dtype ?
                      defaultValue :
                      tfOps.cast(defaultValue, sparseValues.dtype))];
          }
          default:
              throw TypeError(`Node type ${node.op} is not implemented`);
      }
  };

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
  const executeOp$f = (node, tensorMap, context) => {
      switch (node.op) {
          case 'FFT': {
              return [tfOps.fft(getParamValue('x', node, tensorMap, context))];
          }
          case 'IFFT': {
              return [tfOps.ifft(getParamValue('x', node, tensorMap, context))];
          }
          case 'RFFT': {
              return [tfOps.rfft(getParamValue('x', node, tensorMap, context))];
          }
          case 'IRFFT': {
              return [tfOps.irfft(getParamValue('x', node, tensorMap, context))];
          }
          default:
              throw TypeError(`Node type ${node.op} is not implemented`);
      }
  };

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
  const executeOp$g = (node, tensorMap, context) => {
      switch (node.op) {
          case 'Cast': {
              return [tfOps.cast(getParamValue('x', node, tensorMap, context), getParamValue('dtype', node, tensorMap, context))];
          }
          case 'ExpandDims': {
              const axis = getParamValue('axis', node, tensorMap, context);
              return [tfOps.expandDims(getParamValue('x', node, tensorMap, context), axis)];
          }
          case 'Squeeze': {
              const axis = getParamValue('axis', node, tensorMap, context);
              return [tfOps.squeeze(getParamValue('x', node, tensorMap, context), axis)];
          }
          case 'Reshape': {
              return [tfOps.reshape(getParamValue('x', node, tensorMap, context), getParamValue('shape', node, tensorMap, context))];
          }
          case 'MirrorPad': {
              return [tfOps.mirrorPad(getParamValue('x', node, tensorMap, context), getParamValue('padding', node, tensorMap, context), getParamValue('mode', node, tensorMap, context))];
          }
          case 'PadV2':
          case 'Pad': {
              return [tfOps.pad(getParamValue('x', node, tensorMap, context), getParamValue('padding', node, tensorMap, context), getParamValue('constantValue', node, tensorMap, context))];
          }
          case 'SpaceToBatchND': {
              const blockShape = getParamValue('blockShape', node, tensorMap, context);
              const paddings = getParamValue('paddings', node, tensorMap, context);
              return [tfOps.spaceToBatchND(getParamValue('x', node, tensorMap, context), blockShape, paddings)];
          }
          case 'BatchToSpaceND': {
              const blockShape = getParamValue('blockShape', node, tensorMap, context);
              const crops = getParamValue('crops', node, tensorMap, context);
              return [tfOps.batchToSpaceND(getParamValue('x', node, tensorMap, context), blockShape, crops)];
          }
          case 'DepthToSpace': {
              const blockSize = getParamValue('blockSize', node, tensorMap, context);
              const dataFormat = getParamValue('dataFormat', node, tensorMap, context).toUpperCase();
              return [tfOps.depthToSpace(getParamValue('x', node, tensorMap, context), blockSize, dataFormat)];
          }
          case 'BroadcastTo': {
              return [tfOps.broadcastTo(getParamValue('x', node, tensorMap, context), getParamValue('shape', node, tensorMap, context))];
          }
          default:
              throw TypeError(`Node type ${node.op} is not implemented`);
      }
  };

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
  /**
   * Executes the op defined by the node object.
   * @param node
   * @param tensorMap contains tensors for executed nodes and weights
   * @param context contains tensors and information for running the current node.
   * @param resourceManager Optional. Contains global resources of the model.
   */
  function executeOp$h(node, tensorMap, context, resourceManager) {
      const value = ((node, tensorMap, context) => {
          switch (node.category) {
              case 'arithmetic':
                  return tfc.tidy(() => executeOp(node, tensorMap, context));
              case 'basic_math':
                  return tfc.tidy(() => executeOp$1(node, tensorMap, context));
              case 'control':
                  return executeOp$2(node, tensorMap, context);
              case 'convolution':
                  return tfc.tidy(() => executeOp$3(node, tensorMap, context));
              case 'creation':
                  return tfc.tidy(() => executeOp$4(node, tensorMap, context));
              case 'dynamic':
                  return executeOp$5(node, tensorMap, context);
              case 'evaluation':
                  return tfc.tidy(() => executeOp$6(node, tensorMap, context));
              case 'image':
                  return tfc.tidy(() => executeOp$9(node, tensorMap, context));
              case 'graph':
                  return tfc.tidy(() => executeOp$7(node, tensorMap, context));
              case 'logical':
                  return tfc.tidy(() => executeOp$a(node, tensorMap, context));
              case 'matrices':
                  return tfc.tidy(() => executeOp$b(node, tensorMap, context));
              case 'normalization':
                  return tfc.tidy(() => executeOp$c(node, tensorMap, context));
              case 'reduction':
                  return tfc.tidy(() => executeOp$d(node, tensorMap, context));
              case 'slice_join':
                  return tfc.tidy(() => executeOp$e(node, tensorMap, context));
              case 'spectral':
                  return tfc.tidy(() => executeOp$f(node, tensorMap, context));
              case 'transformation':
                  return tfc.tidy(() => executeOp$g(node, tensorMap, context));
              case 'hash_table':
                  return executeOp$8(node, tensorMap, context, resourceManager);
              case 'custom':
                  const opMapper = getRegisteredOp(node.op);
                  if (opMapper && opMapper.customExecutor) {
                      return opMapper.customExecutor(new NodeValueImpl(node, tensorMap, context));
                  }
                  else {
                      throw TypeError(`Custom op ${node.op} is not registered.`);
                  }
              default:
                  throw TypeError(`Unknown op '${node.op}'. File an issue at ` +
                      `https://github.com/tensorflow/tfjs/issues so we can add it` +
                      `, or register a custom execution with tf.registerOp()`);
          }
      })(node, tensorMap, context);
      if (tfc.util.isPromise(value)) {
          return value.then((data) => [].concat(data));
      }
      return [].concat(value);
  }

  /**
   * ExecutionContext captures the runtime environment of the node. It keeps
   * track of the current frame and iteration for the control flow ops.
   *
   * For example, typical Dynamic RNN model may contain loops, for which
   * TensorFlow will generate graphs with Enter/Exit nodes to control the
   * current execution frame, and NextIteration Nodes for iteration id increment.
   * For model with branch logic, TensorFLow will generate Switch/Merge ops.
   */
  class ExecutionContext {
      constructor(weightMap = {}, tensorArrayMap = {}, tensorListMap = {}, functionMap = {}) {
          this.weightMap = weightMap;
          this.tensorArrayMap = tensorArrayMap;
          this.tensorListMap = tensorListMap;
          this.functionMap = functionMap;
          this.rootContext = { id: 0, frameName: '', iterationId: 0 };
          this.contexts = [this.rootContext];
          this.lastId = 0;
          this.generateCurrentContextIds();
      }
      newFrame(id, frameName) {
          return { id, frameName, iterationId: 0 };
      }
      /**
       * Set the current context
       * @param contexts: ExecutionContextInfo[] the current path of execution
       * frames
       */
      set currentContext(contexts) {
          if (this.contexts !== contexts) {
              this.contexts = contexts;
              this.generateCurrentContextIds();
          }
      }
      get currentContext() {
          return this.contexts;
      }
      /**
       * Returns the current context in string format.
       */
      get currentContextId() {
          return this._currentContextIds[0];
      }
      /**
       * Returns the current context and all parent contexts in string format.
       * This allow access to the nodes in the current and parent frames.
       */
      get currentContextIds() {
          return this._currentContextIds;
      }
      generateCurrentContextIds() {
          const names = [];
          for (let i = 0; i < this.contexts.length - 1; i++) {
              const contexts = this.contexts.slice(0, this.contexts.length - i);
              names.push(this.contextIdforContexts(contexts));
          }
          names.push('');
          this._currentContextIds = names;
      }
      contextIdforContexts(contexts) {
          return contexts ?
              contexts
                  .map(context => (context.id === 0 && context.iterationId === 0) ?
                  '' :
                  `${context.frameName}-${context.iterationId}`)
                  .join('/') :
              '';
      }
      /**
       * Enter a new frame, a new context is pushed on the current context list.
       * @param frameId new frame id
       */
      enterFrame(frameId) {
          if (this.contexts) {
              this.lastId++;
              this.contexts = this.contexts.slice();
              this.contexts.push(this.newFrame(this.lastId, frameId));
              this._currentContextIds.unshift(this.contextIdforContexts(this.contexts));
          }
      }
      /**
       * Exit the current frame, the last context is removed from the current
       * context list.
       */
      exitFrame() {
          if (this.contexts && this.contexts.length > 1) {
              this.contexts = this.contexts.slice();
              this.contexts.splice(-1);
              this.currentContextIds.shift();
          }
          else {
              throw new Error('Cannot exit frame, the context is empty');
          }
      }
      /**
       * Enter the next iteration of a loop, the iteration id of last context is
       * increased.
       */
      nextIteration() {
          if (this.contexts && this.contexts.length > 0) {
              this.contexts = this.contexts.slice();
              this.lastId++;
              const context = Object.assign({}, this.contexts[this.contexts.length - 1]);
              context.iterationId += 1;
              context.id = this.lastId;
              this.contexts.splice(-1, 1, context);
              this._currentContextIds.splice(0, 1, this.contextIdforContexts(this.contexts));
          }
          else {
              throw new Error('Cannot increase frame iteration, the context is empty');
          }
      }
      getWeight(name) {
          return this.weightMap[name];
      }
      addTensorArray(tensorArray) {
          this.tensorArrayMap[tensorArray.id] = tensorArray;
      }
      getTensorArray(id) {
          return this.tensorArrayMap[id];
      }
      addTensorList(tensorList) {
          this.tensorListMap[tensorList.id] = tensorList;
      }
      getTensorList(id) {
          return this.tensorListMap[id];
      }
      dispose(keepIds) {
          for (const key in this.tensorArrayMap) {
              this.tensorArrayMap[key].clearAndClose(keepIds);
          }
          for (const key in this.tensorListMap) {
              this.tensorListMap[key].clearAndClose(keepIds);
          }
      }
  }

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
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
  /**
   * Given graph inputs and desired outputs, find the minimal set of nodes
   * to execute in order to compute the outputs. In addition return other useful
   * info such:
   * - Missing inputs needed to compute the output.
   * - Whether the subgraph contains dynamic ops (control flow, dynamic shape).
   * - Alternative inputs in order to avoid async (dynamic op) execution.
   */
  function getExecutionSubgraph(inputs, outputs, weightMap, initNodes) {
      const usedNodes = new Set();
      const missingInputs = [];
      let dynamicNode = null;
      let syncInputs = null;
      // Start with the outputs, going backwards and find all the nodes that are
      // needed to compute those outputs.
      const seen = new Set();
      const inputNodeNames = Object.keys(inputs).map(name => parseNodeName(name)[0]);
      let initNodeNames = [];
      if (initNodes != null) {
          initNodeNames = initNodes.map(node => parseNodeName(node.name)[0]);
      }
      const frontier = [...outputs];
      while (frontier.length > 0) {
          const node = frontier.pop();
          if (isControlFlow(node) || isDynamicShape(node) || isHashTable(node)) {
              if (dynamicNode == null) {
                  dynamicNode = node;
                  syncInputs = dynamicNode.children.map(child => child.name)
                      .filter(name => usedNodes.has(name));
              }
          }
          usedNodes.add(node.name);
          // Weights are dead end since we already have their values.
          if (weightMap[node.name] != null) {
              continue;
          }
          // This node is a dead end since it's one of the user-provided inputs.
          if (inputNodeNames.indexOf(node.name) !== -1) {
              continue;
          }
          // This node is a dead end since it doesn't have any inputs.
          if (initNodeNames.indexOf(node.name) !== -1) {
              continue;
          }
          if (node.inputs.length === 0) {
              missingInputs.push(node.name);
              continue;
          }
          node.inputs.forEach(input => {
              // Don't add to the frontier if it is already there.
              if (seen.has(input.name)) {
                  return;
              }
              seen.add(input.name);
              frontier.push(input);
          });
      }
      return { inputs, outputs, usedNodes, missingInputs, dynamicNode, syncInputs };
  }
  /**
   * Given the execution info, return a list of nodes in topological order that
   * need to be executed to compute the output.
   */
  function getNodesInTopologicalOrder(graph, weightMap, executionInfo) {
      const { usedNodes, inputs } = executionInfo;
      const frontier = [];
      const inputNodes = Object.keys(inputs)
          .map(name => parseNodeName(name)[0])
          .map(name => graph.nodes[name]);
      const initNodes = graph.initNodes;
      inputNodes.forEach(input => {
          if (usedNodes.has(input.name)) {
              frontier.push(input);
          }
      });
      graph.weights.forEach(weight => {
          if (usedNodes.has(weight.name)) {
              frontier.push(weight);
          }
      });
      if (initNodes != null) {
          initNodes.forEach(node => {
              if (usedNodes.has(node.name)) {
                  frontier.push(node);
              }
          });
      }
      const seen = new Set();
      const orderedNodes = [];
      while (frontier.length > 0) {
          const node = frontier.pop();
          seen.add(node.name);
          if (!weightMap[node.name]) {
              orderedNodes.push(node);
          }
          node.children.forEach(child => {
              if (!seen.has(child.name) && usedNodes.has(child.name) &&
                  child.inputs.every(input => seen.has(input.name))) {
                  frontier.push(child);
              }
          });
      }
      return orderedNodes;
  }
  const CONTROL_FLOW_OPS = [
      'Switch', 'Merge', 'Enter', 'Exit', 'NextIteration', 'StatelessIf',
      'StatelessWhile', 'if', 'While'
  ];
  const DYNAMIC_SHAPE_OPS = [
      'NonMaxSuppressionV2', 'NonMaxSuppressionV3', 'NonMaxSuppressionV5', 'Where'
  ];
  const HASH_TABLE_OPS = [
      'HashTable', 'HashTableV2', 'LookupTableImport', 'LookupTableImportV2',
      'LookupTableFind', 'LookupTableFindV2', 'LookupTableSize', 'LookupTableSizeV2'
  ];
  function isControlFlow(node) {
      return CONTROL_FLOW_OPS.indexOf(node.op) >= 0;
  }
  function isDynamicShape(node) {
      return DYNAMIC_SHAPE_OPS.indexOf(node.op) >= 0;
  }
  function isHashTable(node) {
      return HASH_TABLE_OPS.indexOf(node.op) >= 0;
  }

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
  class GraphExecutor {
      /**
       *
       * @param graph Graph the model or function graph to be executed.
       * @param parent When building function exector you need to set the parent
       * executor. Since the weights and function executor maps are set at parant
       * level, that function executor can access the function maps and weight maps
       * through the parent.
       */
      constructor(graph, parent) {
          this.graph = graph;
          this.parent = parent;
          this.compiledMap = new Map();
          this._weightMap = {};
          this.SEPERATOR = ',';
          this._functions = {};
          this._functionExecutorMap = {};
          this._outputs = graph.outputs;
          this._inputs = graph.inputs;
          this._initNodes = graph.initNodes;
          this._signature = graph.signature;
          this._functions = graph.functions;
          // create sub-graph executors
          if (graph.functions != null) {
              Object.keys(graph.functions).forEach(name => {
                  this._functionExecutorMap[name] =
                      new GraphExecutor(graph.functions[name], this);
              });
          }
      }
      get weightIds() {
          return this.parent ? this.parent.weightIds : this._weightIds;
      }
      get functionExecutorMap() {
          return this.parent ? this.parent.functionExecutorMap :
              this._functionExecutorMap;
      }
      get weightMap() {
          return this.parent ? this.parent.weightMap : this._weightMap;
      }
      set weightMap(weightMap) {
          const weightIds = Object.keys(weightMap).map(key => weightMap[key].map(tensor => tensor.id));
          this._weightIds = [].concat(...weightIds);
          this._weightMap = weightMap;
      }
      /**
       * Set `ResourceManager` shared by executors of a model.
       * @param resourceManager: `ResourceManager` of the `GraphModel`.
       */
      set resourceManager(resourceManager) {
          this._resourceManager = resourceManager;
      }
      get inputs() {
          return this._inputs.map(node => {
              return {
                  name: node.name,
                  shape: node.attrParams['shape'] ?
                      node.attrParams['shape'].value :
                      undefined,
                  dtype: node.attrParams['dtype'] ?
                      node.attrParams['dtype'].value :
                      undefined
              };
          });
      }
      get outputs() {
          return this._outputs.map(node => {
              return {
                  name: node.name,
                  shape: node.attrParams['shape'] ?
                      node.attrParams['shape'].value :
                      undefined,
                  dtype: node.attrParams['dtype'] ?
                      node.attrParams['dtype'].value :
                      undefined
              };
          });
      }
      get inputNodes() {
          return this._inputs.map(node => node.signatureKey || node.name);
      }
      get outputNodes() {
          return this._outputs.map((node) => {
              const name = node.signatureKey || node.name;
              return node.defaultOutput ? (`${name}:${node.defaultOutput}`) : name;
          });
      }
      get functions() {
          return Object.keys(this._functions).reduce((map, key) => {
              map[key] = this._functions[key].signature;
              return map;
          }, {});
      }
      getCompilationKey(inputs, outputs) {
          const sortedInputs = inputs.map(node => node.name).sort();
          const sortedOutputs = outputs.map(node => node.name).sort();
          return sortedInputs.join(this.SEPERATOR) + '--' +
              sortedOutputs.join(this.SEPERATOR);
      }
      /**
       * Compiles the inference graph and returns the minimal set of nodes that are
       * required for execution, in the correct execution order.
       */
      compile(inputs, outputs) {
          const executionInfo = getExecutionSubgraph(inputs, outputs, this.weightMap, this._initNodes);
          const { missingInputs, dynamicNode, syncInputs } = executionInfo;
          if (dynamicNode != null) {
              throw new Error(`This execution contains the node '${dynamicNode.name}', which has ` +
                  `the dynamic op '${dynamicNode.op}'. Please use ` +
                  `model.executeAsync() instead. Alternatively, to avoid the ` +
                  `dynamic ops, specify the inputs [${syncInputs}]`);
          }
          if (missingInputs.length > 0) {
              const outNames = outputs.map(n => n.name);
              const inNames = Object.keys(inputs);
              throw new Error(`Cannot compute the outputs [${outNames}] from the provided inputs ` +
                  `[${inNames}]. Missing the following inputs: [${missingInputs}]`);
          }
          return getNodesInTopologicalOrder(this.graph, this.weightMap, executionInfo);
      }
      /**
       * Executes the inference for given input tensors.
       * @param inputs Tensor map for the model inputs, keyed by the input node
       * names.
       * @param outputs Optional. output node name from the Tensorflow model, if
       * no outputs are specified, the default outputs of the model would be used.
       * You can inspect intermediate nodes of the model by adding them to the
       * outputs array.
       */
      execute(inputs, outputs) {
          inputs = this.mapInputs(inputs);
          const names = Object.keys(inputs).sort();
          this.checkInputs(inputs);
          this.checkInputShapeAndType(inputs);
          outputs = this.mapOutputs(outputs);
          this.checkOutputs(outputs);
          const inputNodes = names.map(name => this.graph.nodes[parseNodeName(name)[0]]);
          const outputNodeNames = outputs.map(name => parseNodeName(name)[0]);
          let outputNodes = outputNodeNames.map(name => this.graph.nodes[name]);
          // If no outputs are specified, then use the default outputs of the model.
          if (outputNodes.length === 0) {
              outputNodes = this._outputs;
          }
          const compilationKey = this.getCompilationKey(inputNodes, outputNodes);
          // Do nothing if the compiled graph cache contains the input.
          let orderedNodes = this.compiledMap.get(compilationKey);
          if (orderedNodes == null) {
              orderedNodes = this.compile(inputs, outputNodes);
              this.compiledMap.set(compilationKey, orderedNodes);
          }
          const tensorArrayMap = {};
          const tensorListMap = {};
          return tfc.tidy(() => {
              const context = new ExecutionContext(this.weightMap, tensorArrayMap, tensorListMap, this.functionExecutorMap);
              const tensorsMap = Object.assign({}, this.weightMap);
              Object.keys(inputs).forEach(name => {
                  const [nodeName, index] = parseNodeName(name);
                  const tensors = [];
                  tensors[index] = inputs[name];
                  tensorsMap[nodeName] = tensors;
              });
              const tensorsToKeep = this.getFrozenTensorIds(tensorsMap);
              const intermediateTensorConsumerCount = {};
              for (let i = 0; i < orderedNodes.length; i++) {
                  const node = orderedNodes[i];
                  if (!tensorsMap[node.name]) {
                      const tensors = executeOp$h(node, tensorsMap, context, this._resourceManager);
                      if (tfc.util.isPromise(tensors)) {
                          throw new Error(`The execution of the op '${node.op}' returned a promise. ` +
                              `Please use model.executeAsync() instead.`);
                      }
                      tensorsMap[node.name] = tensors;
                      this.checkTensorForDisposal(node.name, node, tensorsMap, context, tensorsToKeep, outputNodeNames, intermediateTensorConsumerCount);
                  }
              }
              // dispose the context for the root executor
              if (this.parent == null) {
                  context.dispose(tensorsToKeep);
              }
              return outputs.map(name => getTensor(name, tensorsMap, context));
          });
      }
      getFrozenTensorIds(tensorMap) {
          const ids = [].concat.apply([], Object.keys(tensorMap)
              .map(key => tensorMap[key])
              .map(tensors => tensors.map(tensor => tensor.id)));
          return new Set(ids);
      }
      checkTensorForDisposal(nodeName, node, tensorMap, context, tensorsToKeep, outputNames, intermediateTensorConsumerCount) {
          // Skip output nodes and any control flow nodes, since its dependency is
          // tricky to track correctly.
          if (node.category === 'control' || outputNames.indexOf(nodeName) !== -1) {
              return;
          }
          tensorMap[nodeName].forEach(tensor => {
              if (tensor != null) {
                  intermediateTensorConsumerCount[tensor.id] =
                      (intermediateTensorConsumerCount[tensor.id] || 0) +
                          node.children.length;
              }
          });
          node.inputs.forEach(input => {
              // Skip any control flow nodes, since its dependency is tricky to track
              // correctly.
              if (input.category !== 'control') {
                  const tensors = getTensorsForCurrentContenxt(input.name, tensorMap, context);
                  if (tensors != null) {
                      tensors.forEach(tensor => {
                          if (tensor && !tensor.kept && !tensorsToKeep.has(tensor.id)) {
                              const count = intermediateTensorConsumerCount[tensor.id];
                              if (count === 1) {
                                  tensor.dispose();
                                  delete intermediateTensorConsumerCount[tensor.id];
                              }
                              else if (count != null) {
                                  // only intermediate nodes has count set, inputs and weights are
                                  // not.
                                  intermediateTensorConsumerCount[tensor.id]--;
                              }
                          }
                      });
                  }
              }
          });
      }
      /**
       * Executes the inference for given input tensors in Async fashion.
       * @param inputs Tensor map for the model inputs, keyed by the input node
       * names.
       * @param outputs output node name from the Tensorflow model, if no outputs
       * are specified, the default outputs of the model would be used. You can
       * inspect intermediate nodes of the model by adding them to the outputs
       * array.
       */
      async executeAsync(inputs, outputs) {
          return this._executeAsync(inputs, outputs);
      }
      /**
       * Executes the inference for given input tensors in Async fashion.
       * @param inputs Tensor map for the model inputs, keyed by the input node
       * names.
       * @param outputs Optional. output node name from the Tensorflow model,
       * if no outputs are specified, the default outputs of the model would be
       * used. You can inspect intermediate nodes of the model by adding them to the
       * outputs array.
       * @param isFunctionExecution Optional. Flag for executing a function.
       * @param tensorArrayMap Optional, global TensorArray map by id. Used for
       * function execution.
       * @param tensorArrayMap Optinal global TensorList map by id. Used for
       * function execution.
       */
      async _executeAsync(inputs, outputs, isFunctionExecution = false, tensorArrayMap = {}, tensorListMap = {}) {
          if (!isFunctionExecution) {
              inputs = this.mapInputs(inputs);
              this.checkInputs(inputs);
              this.checkInputShapeAndType(inputs);
              outputs = this.mapOutputs(outputs);
              this.checkOutputs(outputs);
          }
          const context = new ExecutionContext(this.weightMap, tensorArrayMap, tensorListMap, this.functionExecutorMap);
          // Graph with control flow op requires runtime evaluation of the execution
          // order, while without control flow the execution order is pre-determined
          // in the compile method.
          const tensorMap = await this.executeWithControlFlow(inputs, context, outputs, isFunctionExecution);
          const results = outputs.map(name => getTensor(name, tensorMap, context));
          // dispose all the intermediate tensors
          const outputIds = results.map(t => t.id);
          const inputIds = Object.keys(inputs).map(name => inputs[name].id);
          const keepIds = new Set([...outputIds, ...inputIds, ...this.weightIds]);
          Object.keys(tensorMap).forEach(key => {
              const tensorArray = tensorMap[key];
              tensorArray.forEach(tensor => {
                  if (tensor && !tensor.kept && !tensor.isDisposed &&
                      !keepIds.has(tensor.id)) {
                      tensor.dispose();
                  }
              });
          });
          // dispose the context for the root executor
          if (this.parent == null) {
              context.dispose(keepIds);
          }
          return results;
      }
      async executeFunctionAsync(inputs, tensorArrayMap, tensorListMap) {
          const mappedInputs = inputs.reduce((map, tensor, index) => {
              map[this.inputs[index].name] = tensor;
              return map;
          }, {});
          return this._executeAsync(mappedInputs, this.outputNodes, true, tensorArrayMap, tensorListMap);
      }
      /**
       * When there are control flow nodes in the graph, the graph execution use
       * ExecutionContext to keep track of the frames and loop iterators.
       * @param inputs placeholder tensors for the graph.
       * @param context the execution context object for current execution.
       * @param outputNames Optional. output node name from the Tensorflow model,
       * if no outputs are specified, the default outputs of the model would be
       * used. You can inspect intermediate nodes of the model by adding them to the
       * outputs array.
       * @param isFunctionExecution Flag for executing a function.
       */
      async executeWithControlFlow(inputs, context, outputNames, isFunctionExecution) {
          const names = Object.keys(inputs);
          const inputNodes = names.map(name => this.graph.nodes[parseNodeName(name)[0]]);
          const outputNodeNames = outputNames.map(name => parseNodeName(name)[0]);
          let outputNodes = outputNodeNames.map(name => this.graph.nodes[name]);
          // If no outputs are specified, then use the default outputs of the model.
          if (outputNodes.length === 0) {
              outputNodes = this._outputs;
          }
          const { usedNodes, missingInputs, dynamicNode, syncInputs } = getExecutionSubgraph(inputs, outputNodes, this.weightMap, this._initNodes);
          // First nodes to execute include inputNodes, weights, and initNodes.
          const stack = [
              ...inputNodes, ...this.graph.weights, ...(this._initNodes || [])
          ].map(node => {
              return { node, contexts: context.currentContext };
          });
          const tensorsMap = Object.assign({}, this.weightMap);
          Object.keys(inputs).forEach(name => {
              const [nodeName, index] = parseNodeName(name);
              const tensors = [];
              tensors[index] = inputs[name];
              tensorsMap[nodeName] = tensors;
          });
          const intermediateTensorConsumerCount = {};
          const tensorsToKeep = this.getFrozenTensorIds(tensorsMap);
          const added = {};
          while (stack.length > 0) {
              const promises = this.processStack(inputNodes, stack, context, tensorsMap, added, tensorsToKeep, outputNodeNames, intermediateTensorConsumerCount, usedNodes);
              await Promise.all(promises);
          }
          if (dynamicNode == null && !isFunctionExecution) {
              console.warn(`This model execution did not contain any nodes with control flow ` +
                  `or dynamic output shapes. You can use model.execute() instead.`);
          }
          const missingOutputs = outputNodes
              .filter(node => !isControlFlow(node) &&
              !getTensor(node.name, tensorsMap, context))
              .map(node => node.name);
          if (missingOutputs.length > 0) {
              let alternativeMsg = '';
              if (dynamicNode != null) {
                  alternativeMsg =
                      `Alternatively, to avoid the dynamic ops, use model.execute() ` +
                          `and specify the inputs [${syncInputs}]`;
              }
              throw new Error(`Cannot compute the outputs [${missingOutputs}] from the provided ` +
                  `inputs [${names}]. Consider providing the following inputs: ` +
                  `[${missingInputs}]. ${alternativeMsg}`);
          }
          return tensorsMap;
      }
      processStack(inputNodes, stack, context, tensorMap, added, tensorsToKeep, outputNames, intermediateTensorConsumerCount, usedNodes) {
          const promises = [];
          while (stack.length > 0) {
              const item = stack.pop();
              context.currentContext = item.contexts;
              let nodeName = '';
              // The tensor of the Enter op with isConstant set should be set
              // in the parent scope, so it will be available as constant for the
              // whole loop.
              if (item.node.op === 'Enter' &&
                  getParamValue('isConstant', item.node, tensorMap, context)) {
                  [nodeName] = getNodeNameAndIndex(item.node.name, context);
              }
              // only process nodes that are not in the tensorMap yet, this include
              // inputNodes and internal initNodes.
              if (tensorMap[item.node.name] == null) {
                  const tensors = executeOp$h(item.node, tensorMap, context, this._resourceManager);
                  if (!nodeName) {
                      [nodeName] = getNodeNameAndIndex(item.node.name, context);
                  }
                  const currentContext = context.currentContext;
                  if (tfc.util.isPromise(tensors)) {
                      promises.push(tensors.then(t => {
                          tensorMap[nodeName] = t;
                          context.currentContext = currentContext;
                          this.checkTensorForDisposal(nodeName, item.node, tensorMap, context, tensorsToKeep, outputNames, intermediateTensorConsumerCount);
                          this.processChildNodes(item.node, stack, context, tensorMap, added, usedNodes);
                          return t;
                      }));
                  }
                  else {
                      tensorMap[nodeName] = tensors;
                      this.checkTensorForDisposal(nodeName, item.node, tensorMap, context, tensorsToKeep, outputNames, intermediateTensorConsumerCount);
                      this.processChildNodes(item.node, stack, context, tensorMap, added, usedNodes);
                  }
              }
              else {
                  this.processChildNodes(item.node, stack, context, tensorMap, added, usedNodes);
              }
          }
          return promises;
      }
      processChildNodes(node, stack, context, tensorMap, added, usedNodes) {
          node.children.forEach((childNode) => {
              const [nodeName,] = getNodeNameAndIndex(childNode.name, context);
              if (added[nodeName] || !usedNodes.has(childNode.name)) {
                  return;
              }
              // Merge op can be pushed if any of its inputs has value.
              if (childNode.op === 'Merge') {
                  if (childNode.inputNames.some(name => {
                      return !!getTensor(name, tensorMap, context);
                  })) {
                      added[nodeName] = true;
                      stack.push({ contexts: context.currentContext, node: childNode });
                  }
              }
              else // Otherwise all inputs must to have value.
               if (childNode.inputNames.every(name => {
                  return !!getTensor(name, tensorMap, context);
              })) {
                  added[nodeName] = true;
                  stack.push({ contexts: context.currentContext, node: childNode });
              }
          });
      }
      /**
       * Releases the memory used by the weight tensors.
       */
      dispose() {
          Object.keys(this.weightMap)
              .forEach(key => this.weightMap[key].forEach(tensor => tensor.dispose()));
      }
      checkInputShapeAndType(inputs) {
          Object.keys(inputs).forEach(name => {
              const input = inputs[name];
              const [nodeName,] = parseNodeName(name);
              const node = this.graph.nodes[nodeName];
              if (node.attrParams['shape'] && node.attrParams['shape'].value) {
                  const shape = node.attrParams['shape'].value;
                  const match = shape.length === input.shape.length &&
                      input.shape.every((dim, index) => shape[index] === -1 || shape[index] === dim);
                  tfc.util.assert(match, () => `The shape of dict['${node.name}'] provided in ` +
                      `model.execute(dict) must be [${shape}], but was ` +
                      `[${input.shape}]`);
              }
              if (node.attrParams['dtype'] && node.attrParams['dtype'].value) {
                  tfc.util.assert(input.dtype === node.attrParams['dtype'].value, () => `The dtype of dict['${node.name}'] provided in ` +
                      `model.execute(dict) must be ` +
                      `${node.attrParams['dtype'].value}, but was ${input.dtype}`);
              }
          });
      }
      mapInputs(inputs) {
          const result = {};
          for (const inputName in inputs) {
              if (this._signature != null && this._signature.inputs != null &&
                  this._signature.inputs[inputName] != null) {
                  const tensor = this._signature.inputs[inputName];
                  result[tensor.name] = inputs[inputName];
              }
              else {
                  result[inputName] = inputs[inputName];
              }
          }
          return result;
      }
      checkInputs(inputs) {
          const notInGraph = Object.keys(inputs).filter(name => {
              const [nodeName] = parseNodeName(name);
              return this.graph.nodes[nodeName] == null;
          });
          if (notInGraph.length > 0) {
              throw new Error(`The dict provided in model.execute(dict) has ` +
                  `keys: [${notInGraph}] that are not part of graph`);
          }
      }
      mapOutputs(outputs) {
          return outputs.map(name => {
              if (this._signature != null && this._signature.outputs != null &&
                  this._signature.outputs[name] != null) {
                  const tensor = this._signature.outputs[name];
                  return tensor.name;
              }
              return name;
          }, {});
      }
      checkOutputs(outputs) {
          outputs.forEach(name => {
              const [normalizedName] = parseNodeName(name);
              if (!this.graph.nodes[normalizedName]) {
                  throw new Error(`The output '${name}' is not found in the graph`);
              }
          });
      }
  }

  /**
   * Contains global resources of a model.
   */
  class ResourceManager {
      constructor(hashTableNameToHandle = {}, hashTableMap = {}) {
          this.hashTableNameToHandle = hashTableNameToHandle;
          this.hashTableMap = hashTableMap;
      }
      /**
       * Register a `HashTable` in the resource manager.
       *
       * The `HashTable` can be retrieved by `resourceManager.getHashTableById`,
       * where id is the table handle tensor's id.
       *
       * @param name Op node name that creates the `HashTable`.
       * @param hashTable The `HashTable` to be added to resource manager.
       */
      addHashTable(name, hashTable) {
          this.hashTableNameToHandle[name] = hashTable.handle;
          this.hashTableMap[hashTable.id] = hashTable;
      }
      /**
       * Get the table handle by node name.
       * @param name Op node name that creates the `HashTable`. This name is also
       *     used in the inputs list of lookup and import `HashTable` ops.
       */
      getHashTableHandleByName(name) {
          return this.hashTableNameToHandle[name];
      }
      /**
       * Get the actual `HashTable` by its handle tensor's id.
       * @param id The id of the handle tensor.
       */
      getHashTableById(id) {
          return this.hashTableMap[id];
      }
      /**
       * Dispose `ResourceManager`, including its hashTables and tensors in them.
       */
      dispose() {
          for (const key in this.hashTableMap) {
              this.hashTableMap[key].clearAndClose();
              delete this.hashTableMap[key];
          }
          for (const name in this.hashTableNameToHandle) {
              this.hashTableNameToHandle[name].dispose();
              delete this.hashTableNameToHandle[name];
          }
      }
  }

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
  const TFHUB_SEARCH_PARAM = '?tfjs-format=file';
  const DEFAULT_MODEL_NAME = 'model.json';
  /**
   * A `tf.GraphModel` is a directed, acyclic graph built from a
   * SavedModel GraphDef and allows inference execution.
   *
   * A `tf.GraphModel` can only be created by loading from a model converted from
   * a [TensorFlow SavedModel](https://www.tensorflow.org/guide/saved_model) using
   * the command line converter tool and loaded via `tf.loadGraphModel`.
   *
   * @doc {heading: 'Models', subheading: 'Classes'}
   */
  class GraphModel {
      /**
       * @param modelUrl url for the model, or an `io.IOHandler`.
       * @param weightManifestUrl url for the weight file generated by
       * scripts/convert.py script.
       * @param requestOption options for Request, which allows to send credentials
       * and custom headers.
       * @param onProgress Optional, progress callback function, fired periodically
       * before the load is completed.
       */
      constructor(modelUrl, loadOptions = {}) {
          this.modelUrl = modelUrl;
          this.loadOptions = loadOptions;
          this.version = 'n/a';
          if (loadOptions == null) {
              this.loadOptions = {};
          }
          this.resourceManager = new ResourceManager();
      }
      // Returns the version information for the tensorflow model GraphDef.
      get modelVersion() {
          return this.version;
      }
      get inputNodes() {
          return this.executor.inputNodes;
      }
      get outputNodes() {
          return this.executor.outputNodes;
      }
      get inputs() {
          return this.executor.inputs;
      }
      get outputs() {
          return this.executor.outputs;
      }
      get weights() {
          return this.executor.weightMap;
      }
      get metadata() {
          return this.artifacts.userDefinedMetadata;
      }
      get modelSignature() {
          return this.signature;
      }
      findIOHandler() {
          const path = this.modelUrl;
          if (path.load != null) {
              // Path is an IO Handler.
              this.handler = path;
          }
          else if (this.loadOptions.requestInit != null) {
              this.handler = tfc.io.browserHTTPRequest(path, this.loadOptions);
          }
          else {
              const handlers = tfc.io.getLoadHandlers(path, this.loadOptions);
              if (handlers.length === 0) {
                  // For backward compatibility: if no load handler can be found,
                  // assume it is a relative http path.
                  handlers.push(tfc.io.browserHTTPRequest(path, this.loadOptions));
              }
              else if (handlers.length > 1) {
                  throw new Error(`Found more than one (${handlers.length}) load handlers for ` +
                      `URL '${[path]}'`);
              }
              this.handler = handlers[0];
          }
      }
      /**
       * Loads the model and weight files, construct the in memory weight map and
       * compile the inference graph.
       */
      async load() {
          this.findIOHandler();
          if (this.handler.load == null) {
              throw new Error('Cannot proceed with model loading because the IOHandler provided ' +
                  'does not have the `load` method implemented.');
          }
          const artifacts = await this.handler.load();
          return this.loadSync(artifacts);
      }
      /**
       * Synchronously construct the in memory weight map and
       * compile the inference graph. Also initialize hashtable if any.
       *
       * @doc {heading: 'Models', subheading: 'Classes', ignoreCI: true}
       */
      loadSync(artifacts) {
          this.artifacts = artifacts;
          const graph = this.artifacts.modelTopology;
          let signature;
          if (this.artifacts.userDefinedMetadata != null &&
              this.artifacts.userDefinedMetadata.signature != null) {
              signature = // tslint:disable-next-line:no-any
                  this.artifacts.userDefinedMetadata.signature;
          }
          else {
              signature = this.artifacts.signature;
          }
          this.signature = signature;
          this.version = `${graph.versions.producer}.${graph.versions.minConsumer}`;
          const weightMap = tfc.io.decodeWeights(this.artifacts.weightData, this.artifacts.weightSpecs);
          this.executor = new GraphExecutor(OperationMapper.Instance.transformGraph(graph, this.signature));
          this.executor.weightMap = this.convertTensorMapToTensorsMap(weightMap);
          // Attach a model-level resourceManager to each executor to share resources,
          // such as `HashTable`.
          this.executor.resourceManager = this.resourceManager;
          if (artifacts.modelInitializer != null &&
              artifacts.modelInitializer.node != null) {
              const initializer = OperationMapper.Instance.transformGraph(artifacts.modelInitializer);
              this.initializer = new GraphExecutor(initializer);
              this.initializer.weightMap = this.executor.weightMap;
              // Attach a model-level resourceManager to the initializer, the
              // hashTables created from when executing the initializer will be stored
              // in the resourceManager.
              this.initializer.resourceManager = this.resourceManager;
              this.initializer.executeAsync({}, []);
          }
          return true;
      }
      /**
       * Save the configuration and/or weights of the GraphModel.
       *
       * An `IOHandler` is an object that has a `save` method of the proper
       * signature defined. The `save` method manages the storing or
       * transmission of serialized data ("artifacts") that represent the
       * model's topology and weights onto or via a specific medium, such as
       * file downloads, local storage, IndexedDB in the web browser and HTTP
       * requests to a server. TensorFlow.js provides `IOHandler`
       * implementations for a number of frequently used saving mediums, such as
       * `tf.io.browserDownloads` and `tf.io.browserLocalStorage`. See `tf.io`
       * for more details.
       *
       * This method also allows you to refer to certain types of `IOHandler`s
       * as URL-like string shortcuts, such as 'localstorage://' and
       * 'indexeddb://'.
       *
       * Example 1: Save `model`'s topology and weights to browser [local
       * storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage);
       * then load it back.
       *
       * ```js
       * const modelUrl =
       *    'https://storage.googleapis.com/tfjs-models/savedmodel/mobilenet_v2_1.0_224/model.json';
       * const model = await tf.loadGraphModel(modelUrl);
       * const zeros = tf.zeros([1, 224, 224, 3]);
       * model.predict(zeros).print();
       *
       * const saveResults = await model.save('localstorage://my-model-1');
       *
       * const loadedModel = await tf.loadGraphModel('localstorage://my-model-1');
       * console.log('Prediction from loaded model:');
       * model.predict(zeros).print();
       * ```
       *
       * @param handlerOrURL An instance of `IOHandler` or a URL-like,
       * scheme-based string shortcut for `IOHandler`.
       * @param config Options for saving the model.
       * @returns A `Promise` of `SaveResult`, which summarizes the result of
       * the saving, such as byte sizes of the saved artifacts for the model's
       *   topology and weight values.
       *
       * @doc {heading: 'Models', subheading: 'Classes', ignoreCI: true}
       */
      async save(handlerOrURL, config) {
          if (typeof handlerOrURL === 'string') {
              const handlers = tfc.io.getSaveHandlers(handlerOrURL);
              if (handlers.length === 0) {
                  throw new Error(`Cannot find any save handlers for URL '${handlerOrURL}'`);
              }
              else if (handlers.length > 1) {
                  throw new Error(`Found more than one (${handlers.length}) save handlers for ` +
                      `URL '${handlerOrURL}'`);
              }
              handlerOrURL = handlers[0];
          }
          if (handlerOrURL.save == null) {
              throw new Error('GraphModel.save() cannot proceed because the IOHandler ' +
                  'provided does not have the `save` attribute defined.');
          }
          return handlerOrURL.save(this.artifacts);
      }
      /**
       * Execute the inference for the input tensors.
       *
       * @param input The input tensors, when there is single input for the model,
       * inputs param should be a `tf.Tensor`. For models with mutliple inputs,
       * inputs params should be in either `tf.Tensor`[] if the input order is
       * fixed, or otherwise NamedTensorMap format.
       *
       * For model with multiple inputs, we recommend you use NamedTensorMap as the
       * input type, if you use `tf.Tensor`[], the order of the array needs to
       * follow the
       * order of inputNodes array. @see {@link GraphModel.inputNodes}
       *
       * You can also feed any intermediate nodes using the NamedTensorMap as the
       * input type. For example, given the graph
       *    InputNode => Intermediate => OutputNode,
       * you can execute the subgraph Intermediate => OutputNode by calling
       *    model.execute('IntermediateNode' : tf.tensor(...));
       *
       * This is useful for models that uses tf.dynamic_rnn, where the intermediate
       * state needs to be fed manually.
       *
       * For batch inference execution, the tensors for each input need to be
       * concatenated together. For example with mobilenet, the required input shape
       * is [1, 244, 244, 3], which represents the [batch, height, width, channel].
       * If we are provide a batched data of 100 images, the input tensor should be
       * in the shape of [100, 244, 244, 3].
       *
       * @param config Prediction configuration for specifying the batch size and
       * output node names. Currently the batch size option is ignored for graph
       * model.
       *
       * @returns Inference result tensors. The output would be single `tf.Tensor`
       * if model has single output node, otherwise Tensor[] or NamedTensorMap[]
       * will be returned for model with multiple outputs.
       *
       * @doc {heading: 'Models', subheading: 'Classes'}
       */
      predict(inputs, config) {
          return this.execute(inputs, this.outputNodes);
      }
      normalizeInputs(inputs) {
          if (!(inputs instanceof tfc.Tensor) && !Array.isArray(inputs)) {
              // The input is already a NamedTensorMap.
              return inputs;
          }
          inputs = Array.isArray(inputs) ? inputs : [inputs];
          if (inputs.length !== this.inputNodes.length) {
              throw new Error('Input tensor count mismatch,' +
                  `the graph model has ${this.inputNodes.length} placeholders, ` +
                  `while there are ${inputs.length} input tensors.`);
          }
          return this.inputNodes.reduce((map, inputName, i) => {
              map[inputName] = inputs[i];
              return map;
          }, {});
      }
      normalizeOutputs(outputs) {
          outputs = outputs || this.outputNodes;
          return !Array.isArray(outputs) ? [outputs] : outputs;
      }
      /**
       * Executes inference for the model for given input tensors.
       * @param inputs tensor, tensor array or tensor map of the inputs for the
       * model, keyed by the input node names.
       * @param outputs output node name from the Tensorflow model, if no
       * outputs are specified, the default outputs of the model would be used.
       * You can inspect intermediate nodes of the model by adding them to the
       * outputs array.
       *
       * @returns A single tensor if provided with a single output or no outputs
       * are provided and there is only one default output, otherwise return a
       * tensor array. The order of the tensor array is the same as the outputs
       * if provided, otherwise the order of outputNodes attribute of the model.
       *
       * @doc {heading: 'Models', subheading: 'Classes'}
       */
      execute(inputs, outputs) {
          inputs = this.normalizeInputs(inputs);
          outputs = this.normalizeOutputs(outputs);
          const result = this.executor.execute(inputs, outputs);
          return result.length > 1 ? result : result[0];
      }
      /**
       * Executes inference for the model for given input tensors in async
       * fashion, use this method when your model contains control flow ops.
       * @param inputs tensor, tensor array or tensor map of the inputs for the
       * model, keyed by the input node names.
       * @param outputs output node name from the Tensorflow model, if no outputs
       * are specified, the default outputs of the model would be used. You can
       * inspect intermediate nodes of the model by adding them to the outputs
       * array.
       *
       * @returns A Promise of single tensor if provided with a single output or
       * no outputs are provided and there is only one default output, otherwise
       * return a tensor map.
       *
       * @doc {heading: 'Models', subheading: 'Classes'}
       */
      async executeAsync(inputs, outputs) {
          inputs = this.normalizeInputs(inputs);
          outputs = this.normalizeOutputs(outputs);
          const result = await this.executor.executeAsync(inputs, outputs);
          return result.length > 1 ? result : result[0];
      }
      convertTensorMapToTensorsMap(map) {
          return Object.keys(map).reduce((newMap, key) => {
              newMap[key] = [map[key]];
              return newMap;
          }, {});
      }
      /**
       * Releases the memory used by the weight tensors and resourceManager.
       *
       * @doc {heading: 'Models', subheading: 'Classes'}
       */
      dispose() {
          this.executor.dispose();
          if (this.initializer) {
              this.initializer.dispose();
          }
          this.resourceManager.dispose();
      }
  }
  /**
   * Load a graph model given a URL to the model definition.
   *
   * Example of loading MobileNetV2 from a URL and making a prediction with a
   * zeros input:
   *
   * ```js
   * const modelUrl =
   *    'https://storage.googleapis.com/tfjs-models/savedmodel/mobilenet_v2_1.0_224/model.json';
   * const model = await tf.loadGraphModel(modelUrl);
   * const zeros = tf.zeros([1, 224, 224, 3]);
   * model.predict(zeros).print();
   * ```
   *
   * Example of loading MobileNetV2 from a TF Hub URL and making a prediction with
   * a zeros input:
   *
   * ```js
   * const modelUrl =
   *    'https://tfhub.dev/google/imagenet/mobilenet_v2_140_224/classification/2';
   * const model = await tf.loadGraphModel(modelUrl, {fromTFHub: true});
   * const zeros = tf.zeros([1, 224, 224, 3]);
   * model.predict(zeros).print();
   * ```
   * @param modelUrl The url or an `io.IOHandler` that loads the model.
   * @param options Options for the HTTP request, which allows to send credentials
   *    and custom headers.
   *
   * @doc {heading: 'Models', subheading: 'Loading'}
   */
  async function loadGraphModel(modelUrl, options = {}) {
      if (modelUrl == null) {
          throw new Error('modelUrl in loadGraphModel() cannot be null. Please provide a url ' +
              'or an IOHandler that loads the model');
      }
      if (options == null) {
          options = {};
      }
      if (options.fromTFHub) {
          if (modelUrl.load == null) {
              if (!modelUrl.endsWith('/')) {
                  modelUrl = modelUrl + '/';
              }
              modelUrl = `${modelUrl}${DEFAULT_MODEL_NAME}${TFHUB_SEARCH_PARAM}`;
          }
      }
      const model = new GraphModel(modelUrl, options);
      await model.load();
      return model;
  }

  /** @license See the LICENSE file. */
  // This code is auto-generated, do not modify this file!
  const version = '3.4.0';

  exports.GraphModel = GraphModel;
  exports.deregisterOp = deregisterOp;
  exports.loadGraphModel = loadGraphModel;
  exports.registerOp = registerOp;
  exports.version_converter = version;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=tf-converter.es2017.js.map
