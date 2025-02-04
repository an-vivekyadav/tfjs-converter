export const json = [
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
//# sourceMappingURL=hash_table.js.map