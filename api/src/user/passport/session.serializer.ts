/*
 * Copyright © 2024 Hexastack. All rights reserved.
 *
 * Licensed under the GNU Affero General Public License v3.0 (AGPLv3) with the following additional terms:
 * 1. The name "Hexabot" is a trademark of Hexastack. You may not use this name in derivative works without express written permission.
 * 2. All derivative works must include clear attribution to the original creator and software, Hexastack and Hexabot, in a prominent location (e.g., in the software's "About" section, documentation, and README file).
 * 3. SaaS Restriction: This software, or any derivative of it, may not be used to offer a competing product or service (SaaS) without prior written consent from Hexastack. Offering the software as a service or using it in a commercial cloud environment without express permission is strictly prohibited.
 */

import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { SessionUser } from 'express-session';

import { User } from '../schemas/user.schema';
import { UserService } from '../services/user.service';

@Injectable()
export class AuthSerializer extends PassportSerializer {
  constructor(private readonly userService: UserService) {
    super();
  }

  serializeUser(user: User, done: (err: Error, user: SessionUser) => void) {
    done(null, {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
    });
  }

  async deserializeUser(
    payload: SessionUser,
    done: (err: Error, user: SessionUser) => void,
  ) {
    const user = await this.userService.findOne(payload.id);
    user ? done(null, user) : done(null, null);
  }
}