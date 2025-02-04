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
import { keep, scalar, stack, tidy, unstack, util } from '@tensorflow/tfjs-core';
// tslint:disable-next-line: no-imports-from-dist
import * as tfOps from '@tensorflow/tfjs-core/dist/ops/ops_for_converter';
/**
 * Hashtable contains a set of tensors, which can be accessed by key.
 */
export class HashTable {
    /**
     * Constructor of HashTable. Creates a hash table.
     *
     * @param keyDType `dtype` of the table keys.
     * @param valueDType `dtype` of the table values.
     */
    constructor(keyDType, valueDType) {
        this.keyDType = keyDType;
        this.valueDType = valueDType;
        this.handle = scalar(0);
        // tslint:disable-next-line: no-any
        this.tensorMap = new Map();
        keep(this.handle);
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
        return tidy(() => {
            const $values = unstack(values);
            const keysLength = $keys.length;
            const valuesLength = $values.length;
            util.assert(keysLength === valuesLength, () => `The number of elements doesn't match, keys has ` +
                `${keysLength} elements, the values has ${valuesLength} ` +
                `elements.`);
            for (let i = 0; i < keysLength; i++) {
                const key = $keys[i];
                const value = $values[i];
                keep(value);
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
        return tidy(() => {
            const result = [];
            for (let i = 0; i < $keys.length; i++) {
                const key = $keys[i];
                const value = this.findWithDefault(key, defaultValue);
                result.push(value);
            }
            return stack(result);
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
//# sourceMappingURL=hash_table.js.map