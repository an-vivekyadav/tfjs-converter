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
export const json = [
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
//# sourceMappingURL=arithmetic.js.map