/*
 * Copyright © 2024 Hexastack. All rights reserved.
 *
 * Licensed under the GNU Affero General Public License v3.0 (AGPLv3) with the following additional terms:
 * 1. The name "Hexabot" is a trademark of Hexastack. You may not use this name in derivative works without express written permission.
 * 2. All derivative works must include clear attribution to the original creator and software, Hexastack and Hexabot, in a prominent location (e.g., in the software's "About" section, documentation, and README file).
 * 3. SaaS Restriction: This software, or any derivative of it, may not be used to offer a competing product or service (SaaS) without prior written consent from Hexastack. Offering the software as a service or using it in a commercial cloud environment without express permission is strictly prohibited.
 */

export type TFilterKeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

export type TFilterKeysOfNeverType<T> = Omit<T, TFilterKeysOfType<T, []>>;

export type NestedKeys<T> = T extends object
  ? {
      [K in keyof T]: Array<any> extends T[K]
        ? Exclude<K, symbol>
        : K extends symbol
          ? Exclude<K, symbol>
          : `${Exclude<K, symbol>}${'' | `.${NestedKeys<T[K]>}`}`;
    }[keyof T]
  : never;

export type ObjectWithNestedKeys<T, ValueType = any> = Partial<{
  [K in NestedKeys<T>]: ValueType;
}>;

export type TFilterNestedKeysOfType<T, U> = T extends object
  ? {
      [K in keyof T]: T[K] extends U
        ? `${K & string}`
        : T[K] extends object
          ? Array<any> extends T[K]
            ? never
            : `${K & string}.${TFilterNestedKeysOfType<T[K], U>}`
          : never;
    }[keyof T]
  : never;

export type WithoutGenericAny<T> = {
  [K in keyof T as string extends K ? never : K]: T[K];
};

export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object
      ? RecursivePartial<T[P]>
      : T[P];
};
//base controller validator types
type TAllowedKeys<T, TStub, TValue = string[]> = {
  [key in keyof Record<
    TFilterKeysOfType<
      TFilterPopulateFields<TFilterKeysOfNeverType<T>, TStub>,
      TValue
    >,
    TValue
  >]: TValue;
};

export type TValidateProps<T, TStub> = {
  dto:
    | Partial<TAllowedKeys<T, TStub>>
    | Partial<TAllowedKeys<T, TStub, string>>;
  allowedIds: TAllowedKeys<T, TStub> & TAllowedKeys<T, TStub, string>;
};

//populate types
export type TFilterPopulateFields<T, TStub> = Omit<
  T,
  TFilterKeysOfType<TStub, string | number | boolean | object>
>;

//search filter types
type TField<T> = {
  [key in T & string]: { contains: string };
};

type TOrField<T> = {
  where?: {
    or: TField<T>[];
  };
};

type TAndField<T> = {
  where?: TField<T>;
};

type TNorField<T> = {
  where?: {
    [key in T & string]: { '!=': string };
  };
};

export type TSearchFilterValue<T> = TOrField<T> | TAndField<T> | TNorField<T>;

type TOperator = 'eq' | 'iLike' | 'neq';
type TContext = 'and' | 'or';

export type TTransformFieldProps = {
  [x: string]: string | RegExp;
  _id?: string;
  context?: TContext;
  operator?: TOperator;
};